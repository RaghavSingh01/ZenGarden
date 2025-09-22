const express = require('express');
const router = express.Router();
const {
  createReservation,
  getAllReservations,
  getMyReservations,
  getReservation,
  updateReservation,
  cancelReservation
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a reservation (User/Admin)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', protect, authorize('user', 'admin'), createReservation);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations (Admin/Chef only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', protect, authorize('admin', 'chef'), getAllReservations);

/**
 * @swagger
 * /api/reservations/my-reservations:
 *   get:
 *     summary: Get current user's reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-reservations', protect, authorize('user'), getMyReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get a single reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', protect, getReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update reservation (Admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', protect, authorize('admin'), updateReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancel reservation (User can cancel own, Admin can cancel any)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', protect, cancelReservation);

module.exports = router;