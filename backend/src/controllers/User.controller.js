import Event from "../models/Event.model.js";
import User from "../models/User.model.js";

const userController = {
  createUser: async (req, res, next) => {
    try {
      const { name, email } = req.body;

      const user = new User({ name, email });
      await user.save();

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          error: "Not Found",
          message: "User not found",
        });
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find().sort({ name: 1 });

      res.json({
        count: users.length,
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const userId = req.params.id;

      const user = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          error: "Not Found",
          message: "User not found",
        });
      }

      res.json({
        message: "User updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id;

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({
          error: "Not Found",
          message: "User not found",
        });
      }

      await Event.updateMany(
        { registrations: userId },
        { $pull: { registrations: userId } }
      );

      res.json({
        message: "User deleted successfully",
        deleted_user_id: userId,
        note: "User has been removed from all event registrations",
      });
    } catch (error) {
      next(error);
    }
  },

  getUserEvents: async (req, res, next) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: "Not Found",
          message: "User not found",
        });
      }

      const events = await Event.find({ registrations: userId })
        .sort({ date_time: 1 })
        .populate("registrations", "name email");

      const formattedEvents = events.map((event) => ({
        id: event._id,
        title: event.title,
        date_time: event.date_time,
        location: event.location,
        capacity: event.capacity,
        remaining_capacity: event.remaining_capacity,
        capacity_percentage: event.capacity_percentage,
        event_status: event.event_status,
        formatted_date: event.formatted_date,
      }));

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        events: {
          count: formattedEvents.length,
          registered_events: formattedEvents,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
