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
                const deleted=await Appointment.deleteMany({date:"Today"})
                // console.log("Successfullt deleted entries")
        
        
                const update=await Appointment.updateMany({date:"Tomorrow"},{date:"Today"})
        
                // console.log("Success updating",update)
        
            }catch(err){
                console.error("Error deleting entries")
            }
          }, { timezone: 'Asia/Kolkata' });
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
app.get("/appointments_acc1/today", app_Controller.app_today)
app.get("/appointments_acc1/tomorrow", app_Controller.app_tmw)
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
    const { name, time, work,email,date } = req.body;

    if (!name || !time || !work ||!date) {
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
            to: ["kalpeshdholkia1981@gmail.com","supernebula26@gmail.com"], 
            subject: "New Appointment Request! Hoorayyy!",
            text: `Hi,

You have a new appointment request:

Name: ${name}
Work: ${work}
Time: ${time}
Date:${date}

કૃપા કરીને લિંક પર જાઓ:
https://appointments-1.onrender.com/login/bhaikaamkarnedashboard

Regards,
Amrut Hair Art 
Kalpesh Dholakiya 
+91 9898548499
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

            const newAppointment = new Appointment({ name, time, work,email,date });
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
