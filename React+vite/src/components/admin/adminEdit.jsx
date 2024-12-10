import React, { useState, useEffect, useMemo } from "react";
import { useLocation,useParams,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import axios from "axios";
import {config} from '../../config.js'


export const AdminEdit = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentstomorrow, setAppointmentstomorrow] = useState([]);

  //   const {num}=useParams()
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    work: "",
    email:""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate()

  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM",
    "11:00 PM"
  ];
  const convertTo24HourFormat = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  

  const sortedTimeSlots = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const mappedSlots = timeSlots.map((slot) => {
      const { hours, minutes } = convertTo24HourFormat(slot);
      return { time: slot, totalMinutes: hours * 60 + minutes };
    });

    const upcoming = mappedSlots.filter(({ totalMinutes }) => totalMinutes >= currentTimeInMinutes);
    // const past = mappedSlots.filter(({ totalMinutes }) => totalMinutes < currentTimeInMinutes);

    return [...upcoming].map(({ time }) => time);
  }, [timeSlots]);

  const timeSlotMap = useMemo(() => {
    const map = timeSlots.reduce((acc, time) => {
      acc[time] = 1; // Mark all time slots as available initially
      return acc;
    }, {});

    appointments.forEach((app) => {
      map[app.time] = 0; 
    });

    return map;
  }, [appointments, timeSlots]);

  const appStyle = {
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f0f8ff",
    minHeight: "100vh",
    padding: "2rem",
    color: "#333",
  };

  const headerStyle = {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "2rem",
  };

  const formStyle = {
    marginBottom: "2rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    marginBottom: "1rem",
    padding: "0.5rem",
    width: "100%",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const appointmentBox = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  };


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const today = await axios.get(`${config.BACKEND_API || "http://localhost:5000"}/appointments_acc1/today`);
        const tomorrow = await axios.get(`${config.BACKEND_API || "http://localhost:5000"}/appointments_acc1/tomorrow`);

        let fetchedAppointments = today.data.appoi || [];
        setAppointments(fetchedAppointments);

        setAppointmentstomorrow(tomorrow.data.appoi)
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    try {
      // console.log(id);
      const response = await axios.delete(`${config.BACKEND_API || "http://localhost:5000"}/deleteAppointment/${id}`);
      if (response.status === 200) {
        // console.log("Deleted successfully");
        const today = await axios.get(`${config.BACKEND_API || "http://localhost:5000"}/appointments_acc1/today`);
        const tomorrow = await axios.get(`${config.BACKEND_API || "http://localhost:5000"}/appointments_acc1/tomorrow`);

        let fetchedAppointments = today.data.appoi || [];
        setAppointments(fetchedAppointments);

        setAppointmentstomorrow(tomorrow.data.appoi)
        navigate("/admin/edit/here");
      } else {
        console.log("Couldn't Delete. Try Again");
      }
    } catch (err) {
      console.error("Error in Deleting request");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.time || !formData.work) {
      alert("Please fill in all fields!");
      return;
    }
    toast.info("Your request is being sent")

    const newAppointment = {
      name: formData.name,
      time: formData.time,
      work: formData.work,
      email:formData.email
    };

    try {
      const response = await axios.post(`${config.BACKEND_API || "http://localhost:5000"}/request`, newAppointment, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        const resp2 = await axios.get(`${config.BACKEND_API || "http://localhost:5000"}/appointments_acc1/today`);
        if (resp2.status === 200 || resp2.status === 201) {
          setAppointments(resp2.data.appoi);
        }
        setFormData({ name: "", time: "", work: "",email:"" });
      } else {
        console.error("Failed to add appointment:", response);
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      padding: "2rem",
      maxWidth: "800px",
      margin: "0 auto", // Center content horizontally
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "2rem",
        fontSize: "2rem", // Adjust font size for responsiveness
      }}>
        Barber Appointments
      </h1>
    
      {}
 
    <h1>Today</h1>

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
  {
sortedTimeSlots.map((slot, index) => {
      const appointment = appointments.find((app) => app.time === slot);
    return (
      <div
        key={index}
        style={{
          display: "flex", // Use flexbox
          justifyContent: "space-between", // Space between content
          alignItems: "center", // Center vertically
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: "8px",
          backgroundColor: appointment ? "#d4edda" : "#f8d7da",
        }}
      >
        <div>
          {appointment ? (
            <>
              <div><strong>Name:</strong> {appointment.name}</div>
              <div><strong>Time:</strong> {appointment.time}</div>
              <div><strong>Work:</strong> {appointment.work}</div>
            </>
          ) : (
            <div><strong>{slot}</strong> - Available</div>
          )}
        </div>

        {/* Delete Button */}
        {appointment && (
          <button
            style={{
              padding: "0.5rem",
              color: "#fff",
              backgroundColor: "#FF0000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "1rem", // Space from content
            }}
            onClick={() => handleDelete(appointment._id)}
          >
            Delete
          </button>
        )}
      </div>
    );
  })}
</div>

      )}

      <h1>Tomorrow</h1>
      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
  {
sortedTimeSlots.map((slot, index) => {
      const appointment = appointmentstomorrow.find((app) => app.time === slot);
    return (
      <div
        key={index}
        style={{
          display: "flex", // Use flexbox
          justifyContent: "space-between", // Space between content
          alignItems: "center", // Center vertically
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: "8px",
          backgroundColor: appointment ? "#d4edda" : "#f8d7da",
        }}
      >
        <div>
          {appointment ? (
            <>
              <div><strong>Name:</strong> {appointment.name}</div>
              <div><strong>Time:</strong> {appointment.time}</div>
              <div><strong>Work:</strong> {appointment.work}</div>
            </>
          ) : (
            <div><strong>{slot}</strong> - Available</div>
          )}
        </div>

        {/* Delete Button */}
        {appointment && (
          <button
            style={{
              padding: "0.5rem",
              color: "#fff",
              backgroundColor: "#FF0000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "1rem", // Space from content
            }}
            onClick={() => handleDelete(appointment._id)}
          >
            Delete
          </button>
        )}
      </div>
    );
  })}
</div>

      )}
      <ToastContainer />
    </div>
  );
};

export default AdminEdit



