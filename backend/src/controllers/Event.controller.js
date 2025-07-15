import Event from "../models/Event.model.js";
import User from "../models/User.model.js";

const eventController = {
  createEvent: async (req, res, next) => {
    try {
      const { title, date_time, location, capacity } = req.body;

      const event = new Event({
        title,
        date_time: new Date(date_time),
        location,
        capacity,
      });

      await event.save();

      res.status(201).json({
        message: "Event created successfully",
        event_id: event._id,
        event: {
          id: event._id,
          title: event.title,
          date_time: event.date_time,
          location: event.location,
          capacity: event.capacity,
          registrations: [],
          remaining_capacity: event.remaining_capacity,
          capacity_percentage: event.capacity_percentage,
          event_status: event.event_status,
          formatted_date: event.formatted_date,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getEventById: async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id).populate(
        "registrations",
        "name email"
      );

      if (!event) {
        return res.status(404).json({
          error: "Not Found",
          message: "Event not found",
        });
      }

      res.json({
        id: event._id,
        title: event.title,
        date_time: event.date_time,
        location: event.location,
        capacity: event.capacity,
        registrations: event.registrations,
        remaining_capacity: event.remaining_capacity,
        capacity_percentage: event.capacity_percentage,
        event_status: event.event_status,
        formatted_date: event.formatted_date,
      });
    } catch (error) {
      next(error);
    }
  },

  getUpcomingEvents: async (req, res, next) => {
    try {
      const now = new Date();

      const events = await Event.find({ date_time: { $gt: now } })
        .sort({ date_time: 1, location: 1 })
        .populate("registrations", "name email");

      const formattedEvents = events.map((event) => ({
        id: event._id,
        title: event.title,
        date_time: event.date_time,
        location: event.location,
        capacity: event.capacity,
        total_registrations: event.registrations.length,
        remaining_capacity: event.remaining_capacity,
        capacity_percentage: event.capacity_percentage,
        event_status: event.event_status,
        formatted_date: event.formatted_date,
      }));

      res.json({
        count: formattedEvents.length,
        events: formattedEvents,
      });
    } catch (error) {
      next(error);
    }
  },

  registerForEvent: async (req, res, next) => {
    try {
      const { user_id } = req.body;
      const eventId = req.params.id;

      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          error: "Not Found",
          message: "User not found",
        });
      }

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          error: "Not Found",
          message: "Event not found",
        });
      }

      if (event.date_time < new Date()) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Cannot register for past events",
        });
      }

      if (event.registrations.includes(user_id)) {
        return res.status(409).json({
          error: "Conflict",
          message: "User already registered for this event",
        });
      }

      if (event.registrations.length >= event.capacity) {
        return res.status(409).json({
          error: "Conflict",
          message: "Event is full",
        });
      }

      event.registrations.push(user_id);
      await event.save();

      res.json({
        message: "Registration successful",
        event_id: eventId,
        user_id: user_id,
        remaining_capacity: event.capacity - event.registrations.length,
        capacity_percentage: (
          (event.registrations.length / event.capacity) *
          100
        ).toFixed(2),
        event_status: event.event_status,
      });
    } catch (error) {
      next(error);
    }
  },

  cancelRegistration: async (req, res, next) => {
    try {
      const { user_id } = req.body;
      const eventId = req.params.id;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          error: "Not Found",
          message: "Event not found",
        });
      }

      const registrationIndex = event.registrations.indexOf(user_id);
      if (registrationIndex === -1) {
        return res.status(404).json({
          error: "Not Found",
          message: "User not registered for this event",
        });
      }

      event.registrations.splice(registrationIndex, 1);
      await event.save();

      res.json({
        message: "Registration cancelled successfully",
        event_id: eventId,
        user_id: user_id,
        remaining_capacity: event.capacity - event.registrations.length,
        capacity_percentage: (
          (event.registrations.length / event.capacity) *
          100
        ).toFixed(2),
        event_status: event.event_status,
      });
    } catch (error) {
      next(error);
    }
  },

  getEventStats: async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          error: "Not Found",
          message: "Event not found",
        });
      }

      res.json({
        event_id: event._id,
        title: event.title,
        total_registrations: event.registrations.length,
        remaining_capacity: event.remaining_capacity,
        capacity_percentage: parseFloat(event.capacity_percentage),
        event_status: event.event_status,
        formatted_date: event.formatted_date,
        is_past_event: event.date_time < new Date(),
        is_full: event.registrations.length >= event.capacity,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default eventController;
