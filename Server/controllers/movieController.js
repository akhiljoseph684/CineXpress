import Movie from "../models/movieModel.js";

export const createMovie = async (req, res) => {
    try {
        const {
          title,
          description,
          duration,
          language,
          genre,
          releaseDate,
          poster,
          cast
        } = req.body;

        if(!title || !duration || !releaseDate || !poster){
            return res.status(400).json({
                success: false,
                message: "Fill the Empty Fields"
            })
        }

        if(typeof duration !== "number"){
            return res.status(400).json({
                success: false,
                message: "Duration must be a number"
            })
        }
        
        if(duration < 30 || duration > 500){
            return res.status(400).json({
                success: false,
                message: "Duration must be between 30 and 500 minutes"
            })
        }

        let lang = language || [];
        let gen = genre || [];

        if(!lang.length){
            return res.status(400).json({
                success: false,
                message: "Please select at least one language."
            })
        }

        if(!gen.length){
            return res.status(400).json({
                success: false,
                message: "Please select at least one genre."
            })
        }

        const date = new Date(releaseDate);

        if(isNaN(date.getTime())){
            return res.status(400).json({
                success: false,
                message: "Invalid release date format"
            })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if(date < today){
            return res.status(400).json({
                success: false,
                message: "Release date cannot be in the past"
            })
        }

        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 5);

        if(date > maxDate){
            return res.status(400).json({
                success: false,
                message: "Release date is too far in the future"
            });
        }

        const {card, banner, thumbnail} = poster || {};

        if(!card || !banner || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "Please Upload the Images"
            })
        }

        const formatedCast = (cast || []).map((actor) => {
            if(!actor.id){
                return {
                    actorId: null,
                    name: actor.name
                }
            }else{
                return {
                    actorId: actor.id,
                    name: null
                }
            }
        });

        const movie = await Movie.create({
            title,
            description,
            duration,
            language: lang,
            genre: gen,
            releaseDate,
            poster: {
                card,
                banner,
                thumbnail
            },
            cast: formatedCast
        })

        return res.status(201).json({
            success: true,
            message: "Movie Created Successfully",
            movie
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const getAllMovies = async (req, res) => {

    try {
        
        const movies = await Movie.find();

        if(!movies){
            return res.status(404).json({
                success: false,
                message: "Movies are Empty"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Movies Fetched Successfully",
            movies
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

export const getMovieById = async (req, res) => {

    try {
        
        const { id } = req.params;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "ID not found"
            })
        }

        const movie = await Movie.findById(id);

        if(!movie){
            return res.status(400).json({
                success: false,
                message: "Movie is not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Movie details fetched successfully",
            movie
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}