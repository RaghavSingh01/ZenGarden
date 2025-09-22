require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/inventory", inventoryRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Restaurant Management API is running...");
});

// Global error handler (basic)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// Test route
app.get('/test-email', async (req, res) => {
  try {
    await sendPasswordResetEmail(
      { name: 'Test User', email: 'web.dev1013@gmail.com' },
      'http://localhost:5000/reset-password/123'
    );
    res.send('Email sent!');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DB Connection & Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });