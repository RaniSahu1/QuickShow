
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
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
        const {origin } = req.headers;

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
            bookingSeats : selectedSeats
        });

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        });

        showData.markModified('occupiedSeats');
        await showData.save();

        // stripe Gateway Initialization
        res.json({ success: true, message: "Booking created successfully"});
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
