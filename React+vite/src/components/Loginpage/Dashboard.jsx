import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/appointments");
        setAppointments(response.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Appointment actions
  const handleAccept = async (id) => {
    try {
      const response = await axios.put("http://localhost:5000/update", { id });
      if (response.status === 200) {
        const updatedAppointments = await axios.get("http://localhost:5000/appointments");
        setAppointments(updatedAppointments.data || []);
      } else {
        console.log("Couldn't Update. Try Again");
      }
    } catch (err) {
      console.error("Error in accepting request");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deleteAppointment/${id}`);
      if (response.status === 200) {
        setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
      } else {
        console.log("Couldn't Delete. Try Again");
      }
    } catch (err) {
      console.error("Error in deleting request");
    }
  };

  const handleGlobalEdit = () => {
    navigate("/admin/edit/here");
  };

  return (
    <div
      style={{
        minHeight: "95vh",
        backgroundColor: "#f4f4f4",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          backgroundColor: "#2c3e50",
          padding: "15px",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "bold" }}>Amrut Hair Art</h1>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e74c3c",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <button
            onClick={handleGlobalEdit}
            style={{
              backgroundColor: "#f39c12",
              color: "#fff",
              padding: "15px 30px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Edit Appointments
          </button>
        </div>

        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "bold", marginBottom: "30px" }}>
          Appointment Dashboard
        </h2>

        {isLoading ? (
          <p style={{ textAlign: "center", color: "#888" }}>Loading appointments...</p>
        ) : appointments.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "24px", fontWeight: "bold" }}>{appointment.name}</h3>
                <p style={{ margin: "10px 0" }}>Work: {appointment.work}</p>
                <p style={{ margin: "10px 0" }}>Time: {appointment.time}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button
                    onClick={() => handleAccept(appointment._id)}
                    style={{
                      backgroundColor: "#1abc9c",
                      color: "#fff",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(appointment._id)}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>No appointments found.</p>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#2c3e50",
          padding: "15px",
          textAlign: "center",
          color: "#fff",
          marginTop: "20px",
        }}
      >
        <p>Kalpesh Dholakiya</p>
        <p>Contact: 123-456-7890</p>
      </footer>
    </div>
  );
};

export default Dashboard;
