const express = require("express");
const {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  updateMenuItem,
  archiveMenuItem,   // renamed for clarity
  restoreMenuItem
} = require("../controllers/menuController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleCheck");
const validateObjectId  = require("../middleware/validateObjectId");

const router = express.Router();

// Param validator for :id
router.param("id", validateObjectId);

// ----- Public (read only) -----
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItem);

// ----- Protected (write) -----
// Create new menu item (admin only)
router.post("/", protect, authorize("admin"), createMenuItem);

// Update menu item details (admin only)
router.patch("/:id", protect, authorize("admin"), updateMenuItem);

// Toggle availability (optional: give chefs access)
// router.patch("/:id/availability", protect, authorize("admin", "chef"), toggleAvailability);

// Soft delete (archive) instead of permanent delete
router.patch("/:id/archive", protect, authorize("admin"), archiveMenuItem);

// Restore archived item
router.patch("/:id/restore", protect, authorize("admin"), restoreMenuItem);

module.exports = router;