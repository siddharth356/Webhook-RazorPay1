// api/razorpay-webhook.js
export default function handler(req, res) {
  console.log("Webhook hit!");
  res.status(200).send("Serverless function running!");
}

import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const data = req.body;

    console.log("Webhook received:", data);

    // 1️⃣ Extract buyer email from Razorpay payload
    const buyerEmail = data.payload?.payment?.entity?.email;

    if (!buyerEmail) {
      console.error("Buyer email not found in payload!");
      return res.status(400).json({ error: "Buyer email missing" });
    }

    // 2️⃣ System.io product info
    const SYSTEM_IO_PRODUCT_ID = "544903"; // Replace with your product ID
    const SYSTEM_IO_API_KEY =
      "arq9rh4pcduoitot5luxnvjvdbma4ufppjhjtkzwol6940zhwn59l7t7d9mpglj2"; // Replace with your API key
    const PRODUCT_PRICE = 1; // ₹1 for test

    // 3️⃣ Create the order in system.io
    const orderResponse = await axios.post(
      "https://api.systeme.io/products/orders",
      {
        product_id: SYSTEM_IO_PRODUCT_ID,
        buyer_email: buyerEmail,
        price: PRODUCT_PRICE,
      },
      {
        headers: { "x-api-key": SYSTEM_IO_API_KEY },
      }
    );

    console.log("System.io order response:", orderResponse.data);

    // 4️⃣ Send post-purchase email immediately
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
        `,
      },
      {
        headers: { "x-api-key": SYSTEM_IO_API_KEY },
      }
    );

    console.log("Email sent response:", emailResponse.data);

    // 5️⃣ Return success
    res.status(200).json({ message: "Webhook processed, order created, email sent" });
  } catch (err) {
    console.error("Webhook error:", err.message || err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
