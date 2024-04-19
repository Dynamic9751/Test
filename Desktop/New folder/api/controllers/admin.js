const Ticket = require("../models/ticketModel");
const UserData = require("../models/userModel");
const CsvParser = require("json2csv").Parser;

const fetchTickets = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    // Fetch all users tickets from the database
    const tickets = await Ticket.find();
    res.json({ status: 200, tickets });
  } catch (error) {
    res.json({ status: "error", error: "Failed to fetch tickets" });
  }
};

const exportTickets = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { duration } = req.query;
    // const duration = "month";
    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    var start, end;
    if (duration === "day") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      start = today;
      end = tomorrow;
    } else if (duration === "month") {
      const startOfMonth = new Date(today);
      startOfMonth.setDate(1); // Set the date to the first day of the month
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const endOfMonth = new Date(nextMonth);
      endOfMonth.setDate(0); // Set the date to the last day of the current month
      start = startOfMonth;
      end = endOfMonth;
    }

    // Find tickets created on the current date
    let ticket_headers = [];
    const ticketsByDay = await Ticket.find({
      createdAt: { $gte: start, $lt: end },
    });

    ticketsByDay.forEach((ticket) => {
      const { createdAt, companyName, name, email, phoneNumber, issue, assignedEngineer, ServiceType, resolved, remarks } = ticket;
      ticket_headers.push({ createdAt, companyName, name, email, phoneNumber, issue, assignedEngineer, ServiceType, resolved, remarks });
    });
    const csvFields = ["createdAt", "Company Name", "Name", "Email", "Phone", "Issue", "nameForAE", "ServiceType", "Resolved", "remarks"];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(ticket_headers);
    // Get the day and month in the format "DD" and "MM" respectively
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based

    // Construct the filename using the current date
    const filename =
      duration === "day"
        ? `tickets_${day}_${month}.csv`
        : `tickets_${month}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.status(200).end(csvData);
  } catch (err) {
    res.json({ status: 400, error: err.message });
  }
};
	
const fetchEngineers = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    // Fetch all users tickets from the database
    const engineers = await UserData.find({ role: "engineer" });
    res.json({ status: 200, engineers });
  } catch (error) {
    res.json({ status: "error", error: "Failed to fetch engineers" });
  }
};

const assignRole = async (req, res) => {
  const { user_id } = req.params;

  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }
  // Find user who matches the email address and set to engineer
  const user = await UserData.findOneAndUpdate(
    { email: req.body.email },
    { role: "engineer" },
    { new: true }
  );
  if (!user) {
    return res.json({ status: 501, text: "User not found" });
  }
  return res.json({ status: 200 });
};

const setEngineer = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { assignedEngineer: req.body.engineerId },
    { new: true }
  );
  if (!ticket) {
    return res.json({ status: 501, text: "Error in assigning engineer" });
  }
  return res.json({ status: 200 });
};

const acceptTicket = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { accepted: 1 },
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in accepting the ticket." });
  }
  return res.json({ status: 200 });
};

const setPriority = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { priority } = req.body;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { priority: priority },
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in setting priority." });
  }
  return res.json({ status: 200 });
};

const setProblem = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { Problem } = req.body;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { Problem: Problem },
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in setting Problem." });
  }
  return res.json({ status: 200 });
};


const setServiceType = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { ServiceType } = req.body;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { ServiceType: ServiceType },
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in setting ServiceType." });
  }
  return res.json({ status: 200 });
};



const setAMC = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { AMC } = req.body;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    { AMC: AMC},
    { new: true }
  );

  if (!ticket) {
    return res.json({ status: 501, text: "Error in setting AMC." });
  }
  return res.json({ status: 200 });
};





const addMessage = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { userRole, textMessage } = req.body;

  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }
  

  const updatedTicket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    {
      $push: {
        logs: {
          timestamp: Date.now(),
          userRole: userRole,
          message: textMessage,
        },
      },
    },
    { new: true } // This option returns the updated ticket after the update
  );
  //console.log(ticket.logs);
  res.json({ status: 200 });
};

const deleteTicket = async (req, res) => {
  const { user_id, ticket_id } = req.params;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const ticket = await Ticket.findOneAndDelete({ id: ticket_id });

  if (!ticket) {
    res.json({ status: 401 });
  }
  res.json({ status: 200 });
};

module.exports = {
  fetchTickets,
  exportTickets,
  fetchEngineers,
  assignRole,
  setEngineer,
  acceptTicket,
  setPriority,
  setProblem,
  setServiceType,
  setAMC,
  addMessage,
  deleteTicket,
};
