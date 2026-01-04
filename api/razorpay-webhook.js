// api/razorpay-webhook.js
export default function handler(req, res) {
  console.log("Minimal function hit!");
  res.status(200).json({ message: "Function running" });
}
