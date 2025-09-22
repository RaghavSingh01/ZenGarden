const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    tableNumber: {
      type: Number,
      required: [true, "Please provide a table number"],
    },
    reservationTime: {
      type: Date,
      required: [true, "Please provide a reservation time"],
    },
    guests: {
      type: Number,
      required: [true, "Please provide number of guests"],
      min: [1, "Guests must be at least 1"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    specialRequests: {
      type: String,
      trim: true,
      maxLength: [200, "Special requests cannot exceed 200 characters"],
    },
  },
  { timestamps: true }
);

// Index for faster queries (reservationTime + tableNumber)
reservationSchema.index({ reservationTime: 1, tableNumber: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);