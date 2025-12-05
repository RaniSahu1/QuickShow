

// API to check if user is admin

import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true });
}

// api to get dashboard data

export const getDashboardData = async (req, res) => {
    try {
        // Logic to fetch dashboard data
        const bookings = await Booking.find({isPaid :true})
        const activeShows = await Show.find({showDateTime : {$gte : new Date()}}).populate('movie') ;

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings : bookings.length,
            totalRevenue : bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        };
        res.json({ success: true, dashboardData });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.json({ success: false, message: "Error fetching dashboard data" });
    }   
}

// api to get all shows

export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({showDateTime : {$gte : new Date()}}).populate('movie').sort({ showDateTime: 1 } );
        res.json({ success: true, shows });
    }
    catch (error) {
        console.error("Error fetching all shows:", error);
        res.json({ success: false, message: "Error fetching all shows" });
    }
}

// api to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({ 
            path: 'show', 
            populate: { path: 'movie' } 
        }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.json({ success: false, message: "Error fetching all bookings" });
    }   
}
