const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,   // put in .env
  key_secret: process.env.RAZORPAY_KEY_SECRET // put in .env
});

module.exports = razorpayInstance;