const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true },
  byUser: { type: Number, required: true },
  name: { type: String, required: true },
  Model: { type: String, required: true },
  ChassisNO: { type: String, required: true },
  Colour: { type: String, required: true },
  issue: String,	
  channel: String,
  remarks: String,
  temp: String,
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  priority: { type: String, default: "low" },
  Problem: { type: String, default: "" },
  ServiceType: { type: String, default: "" },
  AMC: { type: String, default: "" },
  assignedEngineer: String,
  accepted: { type: Number, default: 0 },
  SaleDate: { type: String, required: true },
  EngineNO: { type: String, required: true },
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
