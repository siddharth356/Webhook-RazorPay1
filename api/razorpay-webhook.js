// api/razorpay-webhook.js
export default function handler(req, res) {
  console.log("Webhook hit:", req.method);
  res.status(200).send("Test OK");
}
