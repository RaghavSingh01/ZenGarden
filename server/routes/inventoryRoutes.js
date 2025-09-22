const express = require('express');
const router = express.Router();
const {
  createInventoryItem,
  getAllInventory,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get inventory (Chef/Admin only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', protect, authorize('chef', 'admin'), getAllInventory);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Add a new inventory item (Admin only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', protect, authorize('admin'), createInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get a single inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', protect, authorize('chef', 'admin'), getInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update inventory item (Chef/Admin only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', protect, authorize('chef', 'admin'), updateInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete inventory item (Admin only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', protect, authorize('admin'), deleteInventoryItem);

module.exports = router;