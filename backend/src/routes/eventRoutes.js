import express from "express";
import eventController from "../controllers/Event.controller.js";
import {
  validateEvent,
  validateRegistration,
} from "../middlewares/validation.js";
const router = express.Router();

router.post("/", validateEvent, eventController.createEvent);

// Get Event Detail
router.get("/:id", eventController.getEventById);

// Register for Event
router.post(
  "/:id/register",
  validateRegistration,
  eventController.registerForEvent
);

// Cancel Registration
router.delete(
  "/:id/register",
  validateRegistration,
  eventController.cancelRegistration
);

// Event Stats
router.get("/:id/stats", eventController.getEventStats);

// List Upcoming Events
router.get("/", eventController.getUpcomingEvents);

export default router;
