const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
const Appointment = require("./Models/Appointment");
const nodemailer = require("nodemailer");
const loginController = require("./controllers/Login")
const app_Controller = require("./controllers/appointment")
const { logged } = require("./middleware/isLogged")
const path=require("path")
const app = express();
const cron=require(('node-cron'))

dotenv.config();
// Middleware
// app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT||5000;

const _dirname=path.resolve()

cron.schedule('0 0 * * *', async () => {
    try{
        const deleted=await Appointment.deleteMany({})
        console.log("Successfullt deleted entries")

    }catch(err){
        console.error("Error deleting entries")
    }
  });
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true,
    useUnifiedTopology: true,})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.post("/login", loginController.login);
app.get("/logout", loginController.logout)
app.get("/appointments_acc1", app_Controller.approved_appointments)
app.put("/update", app_Controller.update)
app.delete("/deleteAppointment/:id", app_Controller.delete)

// Get all appointments
app.get("/appointments", async (req, res) => {
    try {
        // console.log("mongo" ,process.env.MONGO_URI)
        // console.log("Hii appointments")
        const appointments = await Appointment.find({ accepted: false });
        // console.log("appoi", appointments)
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new appointment
app.post("/request", async (req, res) => {
    // console.log("Heyyya")
    const { name, time, work,email } = req.body;

    if (!name || !time || !work) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // console.log("Started sending mail");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables
                pass: process.env.EMAIL_PASS, // Use environment variables
            },
        });
        // console.log("1")

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "jayshree76sharma@gmail.com", // Send request to barber's email
            subject: "New Appointment Request! Hoorayyy!",
            text: `Hi,

You have a new appointment request:

Name: ${name}
Work: ${work}
Time: ${time}

Please respond promptly.

Go to the link:
https://www.amazon.com
`
        };
        // console.log("2")


        // Send the email
        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.error("Error sending mail:", err);
                return res.status(500).json({ message: "Failed to send mail" });
            }

            // console.log("Mail sent:", info.response);

            // Simulate barber's response (accept/reject)
            //   const isAccepted = Math.random() > 0.5; // Simulate random response

            const newAppointment = new Appointment({ name, time, work,email });
            const savedAppointment = await newAppointment.save();
            return res.status(201).json({ status: "accepted", appointment: savedAppointment });

        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.use(express.static(path.join(_dirname,"/React+vite/dist")))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname,"React+vite","dist","index.html"))
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
