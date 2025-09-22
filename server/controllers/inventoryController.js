const Inventory = require("../models/inventoryModel");

// Add inventory item
const createInventoryItem = async (req, res) => {
  try {
    req.body.updatedBy = req.user._id;
    const item = await Inventory.create(req.body);

    res.status(201).json({
      success: true,
      message: "Inventory item added successfully",
      data: { item },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all inventory items
const getAllInventory = async (req, res) => {
  try {
    const { lowStock, page = 1, limit = 10 } = req.query;
    let query = {};

    if (lowStock === "true") {
      query.$expr = { $lte: ["$quantity", "$lowStockAlert"] };
    }

    const items = await Inventory.find(query)
      .populate("updatedBy", "name email")
      .sort({ ingredient: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Inventory.countDocuments(query);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single inventory item
const getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate(
      "updatedBy",
      "name email"
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    res.json({ success: true, data: { item } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
  try {
    req.body.updatedBy = req.user._id;
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("updatedBy", "name email");

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    res.json({
      success: true,
      message: "Inventory item updated successfully",
      data: { item },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    await item.deleteOne();
    res.json({ success: true, message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInventoryItem,
  getAllInventory,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};