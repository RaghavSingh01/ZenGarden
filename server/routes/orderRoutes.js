const express = require("express");
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleCheck");

const router = express.Router();

// User/Admin can place orders
router.post("/", protect, authorize("user", "admin"), createOrder);

// Admin/Chef can see orders
router.get("/", protect, authorize("chef", "admin"), getOrders);

// User sees their own orders
router.get("/my-orders", protect, getMyOrders);

// Everyone can fetch a single order (with access control inside controller)
router.get("/:id", protect, getOrder);

// Chef/Admin can update status
router.put("/:id/status", protect, authorize("chef", "admin"), updateOrderStatus);

// Admin only can delete
router.delete("/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;