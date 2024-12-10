const express=require('express')
const router=express.Router()
const app=express()
const cors=require('cors')
const nodemailer = require("nodemailer");
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const AppointModel=require("../Models/Appointment")
const Appointment = require('../Models/Appointment')

module.exports.approved_appointments=async (req,res)=>{
    try{
        // console.log("acce")
        const appoi=await AppointModel.find({accepted:1})
        // console.log("Yyayyy")
        res.status(200).json({message:"All approved appointments",appoi})

    }catch(err){
        res.status(500).json({error:"Error in fetching appointments"})
    }
}

module.exports.update=async (req,res)=>{
    try{
        // console.log("Majja")
        const {id}=req.body
        // console.log(id)
        const appoi=await Appointment.findByIdAndUpdate({_id:id},{accepted:true},{new:true})
        // appoi.accepted=true
        // console.log("hii",appoi)
        // await appoi.save()

        // console.log("hehee",appoi.time)
        // console.log("email",appoi.email)

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
            to: appoi.email, // Send request to barber's email
            subject: "New Appointment Request!",
            html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
                color: #333;
              }
              .container {
                width: 80%;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
              }
              .header {
                text-align: center;
                font-size: 1.5rem;
                color: #333;
                margin-bottom: 20px;
              }
              .status {
                color: white;
                background-color: #28a745;
                padding: 8px;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 20px;
              }
              .content {
                margin-bottom: 20px;
                line-height: 1.6;
              }
              .details {
                margin: 15px 0;
                font-size: 1rem;
              }
              .footer {
                font-size: 0.9rem;
                color: #555;
                text-align: center;
              }
              .footer a {
                color: #007bff;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                Appointment Request Status
              </div>
              <div class="status">Accepted</div>
              <div class="content">
                <p>Hi,</p>
                <p>The request for the following is <strong>Accepted</strong></p>
                <div class="details">
                  <p><strong>Name:</strong> ${appoi.name}</p>
                  <p><strong>Time:</strong> ${appoi.time}</p>
                  <p><strong>Work:</strong> ${appoi.work}</p>
                </div>
                <p>Please reach Amrut Hair Art at your designated time.</p>
              </div>
              <div >
                <p>Thank you,<br>
                Amrut Hair Art<br>
                Kalpeshkumar Dholakiya</p>
              </div>
            </div>
          </body>
        </html>
      `,
        };

        // console.log("2")


        // Send the email
        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.error("Error sending mail:", err);
                return res.status(500).json({ message: "Failed to send mail" });
            }

            // console.log("Mail sent:", info.response);
            res.status(200).json({message:"Updated",time:appoi.time})
        })

        // console.log("3")



    }catch(err){
        res.status(500).json({message:"Couldn't Update"})
    }
}

module.exports.delete=async(req,res)=>{
    try{
        // const {id} =req.params
        // console.log(id)
        // console.log("Jjj")
        const appoi=await Appointment.deleteOne({_id:req.params.id})
        // console.log("Deleetetttetet",appoi)

        if (appoi.deletedCount === 0)
        {
            // console.log("hatt")

            res.status(500).json({message:"Couldn't Delete"})
        }
        else
        {
            // console.log("Deleetetttetet")

            res.status(200).json({message:"Deleted"})
        }
       
    }catch(err){
        res.status(500).json({error:"Couldn't Delete"})
    }
}