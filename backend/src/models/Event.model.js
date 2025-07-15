import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    date_time: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 1000,
    },
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ date_time: 1, location: 1 });

eventSchema.virtual("remaining_capacity").get(function () {
  return this.capacity - this.registrations.length;
});

eventSchema.virtual("capacity_percentage").get(function () {
  return ((this.registrations.length / this.capacity) * 100).toFixed(2);
});

eventSchema.virtual("event_status").get(function () {
  const now = new Date();
  if (this.date_time < now) {
    return "past";
  } else if (this.registrations.length >= this.capacity) {
    return "full";
  } else {
    return "open";
  }
});

eventSchema.virtual("formatted_date").get(function () {
  return this.date_time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

eventSchema.set("toJSON", { virtuals: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
