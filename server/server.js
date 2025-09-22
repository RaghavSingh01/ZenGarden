// server.js (or app.js)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// 1) CORS — must be first
const allowedOrigins = [
  'http://localhost:5173',
  'https://zen-garden-pink.vercel.app'
  // add more domains if you use previews or a custom domain
];

app.use(cors({
  origin: function(origin, cb) {
    if (!origin) return cb(null, true); // SSR/curl/postman
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true // set to true only if you use cookies for auth
}));

// Ensure every preflight succeeds with correct headers
app.options('*', cors());
app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});

// 2) Core middleware
app.use(express.json());
app.use(cookieParser());

// 3) Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// 4) Routes (ensure these exist)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 5) Not found handler
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// 6) Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API listening on ${port}`);
  console.log('Allowed origins:', allowedOrigins);
});