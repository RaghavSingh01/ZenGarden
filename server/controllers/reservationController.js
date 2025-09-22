const Reservation = require("../models/reservationModel");

// Create reservation
const createReservation = async (req, res) => {
  try {
    const { tableNumber, reservationTime, guests, specialRequests } = req.body;

    const reservation = await Reservation.create({
      user: req.user._id,
      tableNumber,
      reservationTime,
      guests,
      specialRequests,
    });

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: { reservation },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all reservations (admin/chef only)
const getAllReservations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .populate("user", "name email")
      .sort({ reservationTime: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Reservation.countDocuments(query);

    res.json({
      success: true,
      data: {
        reservations,
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

// Get current user's reservations
const getMyReservations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { user: req.user._id };

    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .sort({ reservationTime: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Reservation.countDocuments(query);

    res.json({
      success: true,
      data: {
        reservations,
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


// Get reservation by ID
const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!reservation)
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });

    res.json({ success: true, data: { reservation } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update reservation
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });

    // Only owner or admin can update
    if (
      reservation.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update" });
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Reservation updated successfully",
      data: { reservation: updated },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cancel reservation
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });

    reservation.status = "cancelled";
    await reservation.save();

    res.json({
      success: true,
      message: "Reservation cancelled successfully",
      data: { reservation },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getMyReservations,
  getReservation,
  updateReservation,
  cancelReservation,
};