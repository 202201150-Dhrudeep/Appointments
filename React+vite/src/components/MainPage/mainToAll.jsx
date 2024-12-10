import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import axios from "axios";
import {config} from '../../config.js'


export const MainToAll = () => {
  const [appointments, setAppointments] = useState([]);
  const { num } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    work: "",
    email: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM",
    "11:00 PM"
  ];

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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.BACKEND_API || "http://localhost:5000"}/appointments_acc1`);
        const fetchedAppointments = response.data.appoi || [];
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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
    toast.info("Your request is being sent");

    try {
      const response = await axios.post(`${config.BACKEND_API || "http://localhost:5000"}/request`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        const resp2 = await axios.get(`${config.BACKEND_API || "http://localhost:5000"}/appointments_acc1`);
        if (resp2.status === 200 || resp2.status === 201) {
          setAppointments(resp2.data.appoi);
        }
        setFormData({ name: "", time: "", work: "", email: "" });
      } else {
        console.error("Failed to add appointment:", response);
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "95vh",
        backgroundColor: "#f4f4f4",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          backgroundColor: "#2c3e50",
          width: "100%",
          padding: "15px",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#fff" }}>
          Amrut Hair Art
        </h1>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "40px",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2c3e50" }}>
          Barber Appointments
        </h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />
          <select
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <option value="">Select Time</option>
            {timeSlots.map((time, index) =>
              timeSlotMap[time] === 1 ? (
                <option key={index} value={time}>
                  {time}
                </option>
              ) : null
            )}
          </select>
          <select
            name="work"
            value={formData.work}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <option value="">Select Work</option>
            {["Hair Cutting", "Shaving", "Hair Coloring", "Hair Styling", "Any Work"].map(
              (work, index) => (
                <option key={index} value={work}>
                  {work}
                </option>
              )
            )}
          </select>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              backgroundColor: "#1abc9c",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Add Appointment
          </button>
        </form>
        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div>
            {timeSlots.map((slot, index) => {
              const appointment = appointments.find((app) => app.time === slot);
              return (
                <div
                  key={index}
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: appointment ? "#d4edda" : "#f8d7da",
                  }}
                >
                  {appointment ? (
                    <p>
                      <strong>Name:</strong> {appointment.name} |{" "}
                      <strong>Work:</strong> {appointment.work}
                    </p>
                  ) : (
                    <p>{slot} - Available</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#2c3e50",
          width: "100%",
          padding: "15px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <p>Kalpesh Dholakiya</p>
        <p>Contact: 123-456-7890</p>
      </footer>
      <ToastContainer />
    </div>
  );
};
