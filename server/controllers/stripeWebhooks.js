import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  console.log("🔥 Stripe webhook HIT");
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {
    console.log("❌ Stripe Webhook Signature Verification Failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle session completion (booking payment)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata?.bookingId;

         if (!bookingId) {
        return res.status(200).send("No bookingId");
      }

      const booking = await Booking.findById(bookingId);

       // Prevent duplicate processing
      if (!booking || booking.isPaid) {
        return res.status(200).send("Already processed");
      }

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
         
        });

       // send confirmation email

       await inngest.send({
        name:"app/show.booked",
        data:{bookingId}
       })

        console.log("✅ Payment successful, updated Booking:", bookingId);
      }
    }

    return res.status(200).send("OK");


  } catch (error) {
    console.log("❌ Webhook Processing Error:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};
