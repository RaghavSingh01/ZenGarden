const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dish name is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 800,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      enum: ["starter", "main course", "dessert", "beverage", "other"],
      default: "other",
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    image: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    allergens: {
      type: [String],
      default: [],
    },
    popular: {
      type: Boolean,
      default: false,
      index: true,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    costPrice: {
      type: Number,
      min: 0,
      select: false, // hide from default queries
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Text index for search by name and description
menuSchema.index({ name: "text", description: "text" });

// Useful compound index for menu filtering
menuSchema.index({ category: 1, isAvailable: 1, popular: 1 });

module.exports = mongoose.model("Menu", menuSchema);