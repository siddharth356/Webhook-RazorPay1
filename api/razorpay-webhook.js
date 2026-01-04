import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const buyerEmail = req.body.payload.payment.entity.email;

    const SYSTEM_IO_PRODUCT_ID = "544903";
    const SYSTEM_IO_API_KEY = "arq9rh4pcduoitot5luxnvjvdbma4ufppjhjtkzwol6940zhwn59l7t7d9mpglj2";

    // 1️⃣ Create the order
    const orderResponse = await axios.post(
      "https://api.systeme.io/products/orders",
      {
        product_id: SYSTEM_IO_PRODUCT_ID,
        buyer_email: buyerEmail,
        price: 1  // Test price
      },
      { headers: { "x-api-key": SYSTEM_IO_API_KEY } }
    );

    // 2️⃣ Send the post-purchase email immediately,
    await axios.post(
      "https://api.systeme.io/emails/send",
      {
        to: buyerEmail,
        subject: "Your No Face Editor System is Ready!",
        body: `
          Hey there,

          Your No Face Editor System is ready. 🎉

          Download your PDF guide and templates here:https://drive.google.com/drive/folders/195Okp4LEFMXuiuD_8iiFTL8j51QHaPEx?usp=drive_link

          Happy Editing!
        `
      },
      { headers: { "x-api-key": SYSTEM_IO_API_KEY } }
    );

    res.status(200).json({ message: "Webhook processed & email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook failed" });
  }
}

