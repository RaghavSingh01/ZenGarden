const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    ingredient: {
      type: String,
      required: [true, "Please provide ingredient name"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Please provide ingredient quantity"],
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      enum: ["kg", "g", "liters", "ml", "pcs"],
      default: "kg",
    },
    lowStockAlert: {
      type: Number,
      default: 5, // Notify admin if below this
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Admin or chef who updated inventory
    },
  },
  { timestamps: true }
);

// Auto-update lastUpdated on save
inventorySchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("Inventory", inventorySchema);