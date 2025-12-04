import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res) => {
    try {
        // Logic to fetch now playing movies
        const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing' ,{
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })

        const movies = data.results;
        res.json({success :true, movies : movies});
    } catch (error) {
        console.error("Error fetching now playing movies:", error);
        res.json({success :false, message : "Error fetching now playing movies"});
    }
}

// API to add a new show to the database
export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body;

        let movie = await Movie.findById(movieId);

        if (!movie) {
            // Fetch movie details and credits from TMDB API
            const [movieDetailsResponse , movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }), axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ])

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;
            
            const movieDetails = {
                _id : movieId,
                title : movieApiData.title,
                overview : movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres : movieApiData.genres.map(genre => genre.name),
                casts : movieCreditsData.cast.slice(0, 5).map(cast => cast.name),
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "" ,
                vote_average : movieApiData.vote_average,
                runtime: movieApiData.runtime,
            };
// add movie to database
            movie = await Movie.create(movieDetails);

        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date; // e.g., "2023-10-15"
            show.time .forEach(time => {
                // e.g., "18:30"
                const dateTimeString = `${showDate}T${time}:00`; // "2023-10-15T18:30:00"
                showsToCreate.push({
                    movie : movieId,
                    showDateTime : new Date(dateTimeString),
                    showPrice,
                    occupiedSeats : {}
                });
            });
        });

        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
        }
        res.json({success :true, message : "Show added successfully"});

} catch (error) {
        console.error("Error adding show:", error);
        res.json({success :false, message : "Error adding show"});
    }
}

// Api to get all shows for a database movie
export const getShows = async (req, res) => {
    try {
        
        const shows = await Show.find().populate('movie').sort({ showDateTime: 1 } );

        // filter unique movies from shows
        const uniqueShows = new Set(shows.map(show => show.movie));

        res.json({ success: true, shows : Array.from(uniqueShows) });
    } catch (error) {
        console.error("Error fetching shows:", error);
        res.json({ success: false, message: "Error fetching shows" });
    }       
}

// api to get single show from database
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;
        // get all upcoming shows for the movie
        const shows = await Show.find({movie :movieId , showDateTime : {$gte : new Date()}})

        const movie = await Movie.findById(movieId);
        const dateTime ={}

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split('T')[0]; // "YYYY-MM-DD"
            if(!dateTime[date]){
                dateTime[date] = [];
            }
            dateTime[date].push({
                time : show.showDateTime , showId : show._id });
        });

        res.json({ success: true, movie, dateTime });
    } catch (error) {
        console.error("Error fetching show details:", error);
        res.json({ success: false, message: "Error fetching show details" });
    }           
}