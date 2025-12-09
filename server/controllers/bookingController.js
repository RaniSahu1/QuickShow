
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import Stripe from "stripe";
// function to check availability of seats for a particular show

const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats || {};

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken; // return true if all seats are available
    } catch (error) {
        console.error("Error checking seat availability:", error);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats} = req.body;
        // const {origin } = req.headers.origin || `http://localhost:5173`;
        // Local development URLs (http is OK in test mode)
const FRONTEND_URL = process.env.FRONTEND_URL;

        if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.json({
        success: false,
        message: "Show and at least one seat are required.",
      });
    }

        // check if seats are available
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if(!isAvailable){
            return res.json({ success: false, message: "One or more selected seats are already booked. Please choose different seats." });
        }

        // get the show details
        const showData = await Show.findById(showId).populate('movie');

        

        // create a new booking
        const booking = await Booking.create({
            user : userId,
            show : showId,
            amount : showData.showPrice * selectedSeats.length,
            bookedSeats : selectedSeats
        });

        selectedSeats.forEach((seat) => {
            showData.occupiedSeats[seat] = userId;
        });

        showData.markModified('occupiedSeats');
        await showData.save();

        // stripe Gateway Initialization

        const stripeInstance =  new Stripe(process.env.STRIPE_SECRET_KEY);

        //creating line items to for stripe

        const line_items = [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: showData.movie.title
                    },
                    unit_amount: Math.floor(booking.amount) * 100
                },
                quantity: 1
               
            },
        ];
        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${FRONTEND_URL}/loading/my-bookings`,
            cancel_url : `${FRONTEND_URL}/my-bookings`,
            line_items : line_items,
            mode : 'payment',
            metadata : {
                bookingId : booking._id.toString(),
            },
            expires_at : Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
        })

        booking.paymentLink = session.url;
        await booking.save();


        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.json({ success: false, message: "Error creating booking" });
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        
        const { showId } = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats || {});

        res.json({ success: true, occupiedSeats });


    } catch (error) {
        console.error("Error fetching occupied seats:", error);
        res.json({ success: false, message: "Error fetching occupied seats" });
        
    }
}

export const resetSeatsForShow = async (req, res) => {
  try {
    const { showId } = req.params;

    const showData = await Show.findById(showId);
    if (!showData) return res.json({ success: false, message: "Show not found" });

    showData.occupiedSeats = {}; // Clear all seats
    showData.markModified("occupiedSeats");
    await showData.save();

    await Booking.deleteMany({ show: showId });

    return res.json({ success: true, message: "Seats reset successfully!" });
  } catch (error) {
    console.error("Error resetting seats:", error);
    res.json({ success: false, message: "Error resetting seats" });
  }
};
