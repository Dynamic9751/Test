const express = require("express");
const {
  fetchTickets,
  createTicket,
  createBulkTickets,
  fetchSingleTicket,
  updateTicketStatus,
  addMessage,
} = require("../controllers/user.js");
const authenticateToken = require("../middleware/authorization");

const router = express.Router();

router.get("/:user_id/tickets", authenticateToken, fetchTickets);
router.post("/:user_id/createticket", authenticateToken, createTicket);
router.post("/:user_id/bulkcreateticket", authenticateToken, createBulkTickets);
router.get("/:user_id/ticket/:ticket_id", authenticateToken, fetchSingleTicket);
router.put(
  "/:user_id/ticket/:ticket_id/update",
  authenticateToken,
  updateTicketStatus
);
router.put(
  "/:user_id/ticket/:ticket_id/add_message",
  authenticateToken,
  addMessage
);

module.exports = router;
