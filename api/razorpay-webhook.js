import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const event = req.body.event;
        const payment = req.body.payload.payment.entity;

        // Only process successful payments
        if (event === 'payment.captured' && payment.status === 'captured') {
            try {
                // ---- SYSTEM.IO API CALL ----
                await axios.post('https://api.systeme.io/v1/orders', {
                    email: payment.email,                  // Buyer's email
                    product_id: '544903',                  // Your product ID
                    amount: payment.amount / 100           // Razorpay amount is in paise → convert to INR
                }, {
                    headers: {
                        Authorization: 'Bearer arq9rh4pcduoitot5luxnvjvdbma4ufppjhjtkzwol6940zhwn59l7t7d9mpglj2'
                    }
                });

                console.log('Payment processed for:', payment.email);
                res.status(200).json({ message: 'Webhook processed successfully' });

            } catch (err) {
                console.error('Error processing webhook:', err);
                res.status(500).json({ error: 'Error processing webhook' });
            }
        } else {
            // Ignore non-captured payments
            res.status(200).json({ message: 'Not a captured payment' });
        }
    } else {
        res.status(405).send('Method not allowed');
    }
}
