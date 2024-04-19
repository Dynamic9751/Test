	const Ticket = require("../models/ticketModel");
const { v4: uuidv4 } = require("uuid");

const fetchTickets = async (req, res) => {
  try {
    // Get the user ID from the request object
    const { user_id } = req.params;
    // console.log("Finally", user_id, "===", req.userId); // debug
    // Verify that the user ID matches the authenticated user, we are setting req.userId = payload.userId during authentication.
    if (user_id !== req.userId) {
      // console.log("Hitting !=="); // debug
      return res.sendStatus(403); // Forbidden if user ID doesn't match
    }

    // Fetch the user's tickets from the database and send the response
    const tickets = await Ticket.find({ byUser: user_id });
    res.json({ status: 200, tickets });
  } catch (error) {
    res.json({ status: "error", error: "Failed to fetch tickets" });
  }
};

const createTicket = async (req, res) => {
  try {
    const { user_id } = req.params;
    const newId = uuidv4();

    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden if user ID doesn't match
    }
    const {
      //req.params was not working for some reason, so using the user_id received from frontend
      colour,
	  model,
	  engineNo,
	  chassisNo,
      resolved,
      priority,
      assignedEngineer,
    } = req.body;

    // Create a new ticket document
    const ticket = new Ticket({
      id: newId,
      byUser: user_id,
      colour,
	  model,
	  engineNo,
	  chassisNo,
      resolved,
      priority,
      assignedEngineer,
    });
    // Save the ticket to the database
    await ticket.save();

    res.json({ status: 200 });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Failed to create ticket" });
  }
};


const createBulkTickets = async (req, res) => {
  const { user_id } = req.params;
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }
try {
  const tickets = req.body.map(ticket => ({
      id: uuidv4(), // Assign a new UUID for each ticket
      byUser: user_id, // Set the user ID for each ticket
      colour: ticket.colour,
      model: ticket.model,
      engineNo: ticket.engineNo,
      chassisNo: ticket.chassisNo,
      createdAt: new Date() // Set the creation date to now
    }));


    await Ticket.insertMany(tickets);
    res.json({ status: 200, message: 'Bulk tickets have been successfully created.' });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Failed to create bulk tickets" });
  }
};



const fetchSingleTicket = async (req, res) => {
  try {
    //authenticating the user
    const { user_id } = req.params;
    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    //once authenticated
    const { ticket_id } = req.params;
    const ticket = await Ticket.findOne({ id: ticket_id });
    res.json({ status: 200, ticket });
  } catch (err) {
    console.log(err);
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    //authenticating the user
    const { user_id } = req.params;
    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    //once authenticated
    const { ticket_id } = req.params;
    const filter = { id: ticket_id };
    const update = { resolved: req.body.resolved };
    const doc = await Ticket.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.json({ status: 200 });
  } catch (err) {
    console.log(err);
  }
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
  // console.log(ticket.logs);
  res.json({ status: 200 });
};

module.exports = {
  fetchTickets,
  createTicket,
  createBulkTickets,
  fetchSingleTicket,
  updateTicketStatus,
  addMessage,
};
