// server/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

/* ---------- Core middleware ---------- */

// Log early (only in dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// JSON body parser
app.use(express.json());

// CORS: allow Vite dev and 127.0.0.1
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://zen-garden-pink.vercel.app/'
];

app.use(cors({
  origin: (origin, cb) => {
    // Allow tools without Origin header (Postman/health checks)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false // set to true only if you use cookies for auth
}));

// Ensure all preflights are answered
app.options('', cors());

/* ---------- Health endpoints ---------- */

app.get('/', (req, res) => {
  res.send('Restaurant Management API is running...');
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, env: process.env.NODE_ENV || 'production' });
});

/* ---------- Routes ---------- */

app.use('/api/payment', paymentRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/inventory', inventoryRoutes);

/* ---------- Global error handler ---------- */

app.use((err, req, res, next) => {
  console.error('Error:', err.stack || err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

/* ---------- DB connection & server start ---------- */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Bind on 0.0.0.0 for Render; Node defaults to this if host not provided
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

/* ---------- Notes ----------
- If you switch to cookie-based auth:
  - Set credentials: true in cors options.
  - Set cookies with { httpOnly: true, secure: true, sameSite: 'none' }.
  - On the client, use axios with { withCredentials: true }.

- When you deploy the frontend, add its https origin to allowedOrigins.
*/