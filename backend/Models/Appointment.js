const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  accepted:{
    type: Boolean,
    default:0
  },
  email: {  // Added email field
    type: String,
    required: true,  // You can choose whether it should be required
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
