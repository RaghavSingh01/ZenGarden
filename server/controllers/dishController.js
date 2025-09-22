const Dish = require('../models/Dish');

// @desc Get all dishes
const getAllDishes = async (req, res) => {
  try {
    const { category, available, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (category) query.category = category;
    if (available !== undefined) query.isAvailable = available === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const dishes = await Dish.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Dish.countDocuments(query);

    res.json({
      success: true,
      data: {
        dishes,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single dish
const getDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('createdBy', 'name email');

    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    res.json({ success: true, data: { dish } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create dish (chef or admin)
const createDish = async (req, res) => {
  try {
    if (!['chef', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    req.body.createdBy = req.user._id;
    const dish = await Dish.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: { dish }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Update dish (chef can only update own, admin can update all)
const updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    if (req.user.role !== 'admin' && dish.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this dish' });
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Dish updated successfully', data: { dish: updatedDish } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Delete dish (admin only)
const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can delete dishes' });
    }

    await dish.deleteOne();

    res.json({ success: true, message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle availability (chef can toggle own, admin can toggle all)
const toggleAvailability = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    if (req.user.role !== 'admin' && dish.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this dish' });
    }

    dish.isAvailable = !dish.isAvailable;
    await dish.save();

    res.json({
      success: true,
      message: `Dish ${dish.isAvailable ? 'enabled' : 'disabled'} successfully`,
      data: { dish }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
  toggleAvailability
};