
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken')

const app = express();

// dotenv.config();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())
const PORT = 5000;




app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));


module.exports.logged = async (req, res, next) => {
    try {
        console.log("Isloggedin")
        console.log(req.cookies)

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const data = jwt.verify(token, "secret");
        req.user = data;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Authentication failed" });
    }
};
