const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true },
  byUser: { type: Number, required: true },
  colour: { type: String, required: true },
  model: { type: String, required: true },
  engineNo: { type: String, required: true },
  chassisNo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  logs: [
    {
      timestamp: {
        type: Date,
        default: Date.now(),
      },
      userRole: { type: String, required: true },
      message: String,
    },
  ],
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
