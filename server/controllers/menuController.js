const Menu = require("../models/menuModel");

// helper: pick allowed fields from body
const pick = (obj, allowed) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => allowed.includes(k)));

// Create a new menu item (Admin only)
const createMenuItem = async (req, res) => {
  try {
    const payload = pick(req.body, [
      "name",
      "description",
      "price",
      "category",
      "isAvailable",
      "image",
      "tags",
      "allergens",
      "popular",
      "sku",
    ]);

    const item = await Menu.create({ ...payload, createdBy: req.user._id });
    res
      .status(201)
      .json({ success: true, message: "Menu item created", data: item });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: "Validation failed", errors: error.errors });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Duplicate key", key: error.keyValue });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all menu items (Public)
const getAllMenuItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      isAvailable,
      search,
      sort = "-createdAt",
      fields,
      includeArchived = "false",
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (typeof isAvailable !== "undefined")
      filter.isAvailable = isAvailable === "true";
    if (includeArchived !== "true") filter.isArchived = { $ne: true };
    if (search) filter.$text = { $search: search };

    const projection = fields ? fields.split(",").join(" ") : undefined;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
      Menu.find(filter)
        .select(projection)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Menu.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single menu item
const getMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item || item.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (req, res) => {
  try {
    const payload = pick(req.body, [
      "name",
      "description",
      "price",
      "category",
      "isAvailable",
      "image",
      "tags",
      "allergens",
      "popular",
      "sku",
    ]);

    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      { ...payload, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({ success: true, message: "Menu item updated", data: item });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: "Validation failed", errors: error.errors });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Duplicate key", key: error.keyValue });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Archive (soft delete) menu item (Admin only)
const archiveMenuItem = async (req, res) => {
  try {
    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      { isArchived: true, updatedBy: req.user._id },
      { new: true }
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    res.json({ success: true, message: "Menu item archived" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Restore archived menu item (Admin only)
const restoreMenuItem = async (req, res) => {
  try {
    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      { isArchived: false, updatedBy: req.user._id },
      { new: true }
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    res.json({ success: true, message: "Menu item restored", data: item });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  updateMenuItem,
  archiveMenuItem,
  restoreMenuItem,
};