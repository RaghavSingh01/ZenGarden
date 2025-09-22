const razorpayInstance = require("./config/razorpay");

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // amount in paise (e.g. ₹500 -> 50000)
      currency: currency || "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order
    });
  } catch (err) {
    console.error("Payment Order Error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};