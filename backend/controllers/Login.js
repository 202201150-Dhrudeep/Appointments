const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken')


const app = express();

// dotenv.config();
// Middleware
// app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())




app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));



module.exports.login = (req, res) => {
    try {
        console.log("Login request received");

        const { email, pass } = req.body;
        console.log(email, pass);

        if (email === "hi@gmail.com" && pass === "12") {
            console.log("Login successful");

            const token = jwt.sign({ email, pass }, "secret");
            console.log("token",token)
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // Change to `true` in production with HTTPS
                sameSite: "Lax", // Use `None` if frontend/backend are on different domains
            });
            res.status(200).json({ message: "Login Successful" });
        } else {
            console.log("Invalid credentials");
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.logout = (req, res) => {
    try {
        // res.cookie("token", "", {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "Lax",
        //     expires: new Date(0),
        // });
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
        });
        
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error logging out" });
    }
};
