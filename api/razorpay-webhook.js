import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const data = req.body;
    console.log("Webhook received:", JSON.stringify(data));

    // 1️⃣ Get buyer email from Razorpay payload
    const buyerEmail = data.payload?.payment?.entity?.email;
    if (!buyerEmail) {
      console.error("Buyer email missing in payload");
      return res.status(400).json({ error: "Buyer email missing" });
    }

    // 2️⃣ System.io config
    const SYSTEM_IO_PRODUCT_ID = "544903"; // Replace with your product ID
    const SYSTEM_IO_API_KEY =
      "arq9rh4pcduoitot5luxnvjvdbma4ufppjhjtkzwol6940zhwn59l7t7d9mpglj2"; // Replace with your API key
    const PRODUCT_PRICE = 1; // ₹1 for test

    // 3️⃣ Create order in system.io
    let orderResponse;
    try {
      orderResponse = await axios.post(
        "https://api.systeme.io/products/orders",
        {
          product_id: SYSTEM_IO_PRODUCT_ID,
          buyer_email: buyerEmail,
          price: PRODUCT_PRICE
        },
        {
          headers: { "x-api-key": SYSTEM_IO_API_KEY }
        }
      );
      console.log("System.io order response:", orderResponse.data);
    } catch (err) {
      console.error("System.io order error:", err.response?.data || err.message);
    }

    // 4️⃣ Send post-purchase email
    try {
      const emailResponse = await axios.post(
        "https://api.systeme.io/emails/send",
        {
          to: buyerEmail,
          subject: "Your No Face Editor System is Ready!",
          body: `
Hey there,

Your No Face Editor System is ready. 🎉

Download your PDF guide and templates here: [Insert Download Link]

Happy Editing!
- No Face Editor Team
          `
        },
        {
          headers: { "x-api-key": SYSTEM_IO_API_KEY }
        }
      );
      console.log("Email sent response:", emailResponse.data);
    } catch (err) {
      console.error("Email send error:", err.response?.data || err.message);
    }

    // 5️⃣ Respond success
    res.status(200).json({ message: "Webhook processed" });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
