import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      

      const response = await axios.post(
        `${config.BACKEND_API || "http://localhost:5000"}/login`,
        { email, pass: password },
        { withCredentials: true }
      );

      console.log(response.data);
      if (response.status === 200) {
        navigate("/login/bhaikaamkarnedashboard");
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed!");
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
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#2c3e50",
          width: "100%",
          padding: "15px",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Amrut Hair Art
        </h1>
      </div>

      {/* Login Form */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "40px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#2c3e50",
            marginBottom: "20px",
          }}
        >
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#1abc9c",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "10px",
              width: "100%",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#16a085")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1abc9c")}
          >
            Login
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#2c3e50",
          width: "100%",
          padding: "15px",
          textAlign: "center",
          color: "#fff",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        <p>Kalpesh Dholakiya</p>
        <p>Contact: 123-456-7890</p>
      </footer>
    </div>
  );
};

export default LoginPage;
