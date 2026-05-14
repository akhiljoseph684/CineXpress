import Movie from "../models/movieModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

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
          cast,
          director,
          producer,
          trailer
        } = req.body;

        if(!title){
            return res.status(400).json({
                success: false,
                field: "title",
                message: "Movie title field Required"
            })
        }

        if(!duration){
            return res.status(400).json({
                success: false,
                field: "duration",
                message: "Duration field Required"
            })
        }

        if(!releaseDate){
            return res.status(400).json({
                success: false,
                field: "releaseDate",
                message: "Release Date is Required"
            })
        }

        let dur = Number(duration);

        if(isNaN(dur)){
            return res.status(400).json({
                success: false,
                field: "Duration",
                message: "Duration must be a number"
            })
        }
        
        if(dur < 30 || dur > 500){
            return res.status(400).json({
                success: false,
                field: "Duration",
                message: "Duration must be between 30 and 500 minutes"
            })
        }

        const date = new Date(releaseDate);

        if(isNaN(date.getTime())){
            return res.status(400).json({
                success: false,
                field: "releaseDate",
                message: "Invalid release date format"
            })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if(date < today){
            return res.status(400).json({
                success: false,
                field: "releaseDate",
                message: "Release date cannot be in the past"
            })
        }

        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 5);

        if(date > maxDate){
            return res.status(400).json({
                success: false,
                field: "releaseDate",
                message: "Release date is too far in the future"
            });
        }

        if(!director){
            return res.status(400).json({
                success: false,
                field: "director",
                message: "Director field Required"
            })
        }

        let lang = language || [];
        let gen = genre || [];

        if(!lang.length){
            return res.status(400).json({
                success: false,
                field: "",
                message: "Please select at least one language."
            })
        }

        if(!gen.length){
            return res.status(400).json({
                success: false,
                field: "",
                message: "Please select at least one genre."
            })
        }

        const {card, banner, thumbnail} = poster || {};

        if(!card || !banner || !thumbnail){
            return res.status(400).json({
                success: false,
                field: "",
                message: "Please Upload the Images"
            })
        }

        const formatedCast =
          (cast || []).map((actor) => {
          
            if (actor._id) {
            
              return {
              
                actorId:
                  actor._id,
              
                name: null
              
              };
            }
          
            return {
            
              actorId: null,
            
              name:
                actor.name?.trim() || ""
            
            };
        });

        const movie = await Movie.create({
            title,
            description,
            duration: dur,
            language: lang,
            genre: gen,
            releaseDate,
            director,
            producer,
            trailer,
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
            message: "Something went wrong"
        })
    }

}

export const getAllMovies = async (req, res) => {

    try {

      const {
        title,
        language,
        genre,
        status,
        page,
        limit
      } = req.query;

      let filter = {
        isDeleted: false
      };

      if (status && status !== "all") {
        filter.status =
          status;
      }

      if (title?.trim()) {

        filter.title = {
          $regex:
            title.trim(),

          $options: "i"
        };
      }

      if (language) {

        filter.language = {
          $in: [new mongoose.Types.ObjectId(
            language
          )]
        };
      }

      if (genre) {

        filter.genre = {
          $in: [new mongoose.Types.ObjectId(
            genre
          )]
        };
      }

      const pageNumber = Number(page) || 1;

      const limitNumber = Number(limit) || 12;

      const skip = (pageNumber - 1) * limitNumber;


      const result =
        await Movie.aggregate([
          {
            $match: filter
          },

          {
            $addFields: {

              avgRating: {
                $avg:
                  "$reviews.stars"
              },

              totalRatings: {
                $size:
                  "$reviews"
              }

            }
          },

          {
            $facet: {

              movies: [

                {
                  $lookup: {
                    from:
                      "languages",

                    localField:
                      "language",

                    foreignField:
                      "_id",

                    as:
                      "language"
                  }
                },

                {
                  $lookup: {
                    from:
                      "genres",

                    localField:
                      "genre",

                    foreignField:
                      "_id",

                    as:
                      "genre"
                  }
                },

                {
                  $sort: {
                    avgRating: -1
                  }
                },

                {
                  $skip: skip
                },

                {
                  $limit:
                    limitNumber
                }

              ],

              totalCount: [

                {
                  $count:
                    "count"
                }

              ]

            }
          }

        ]);

      const movies = result[0].movies;

      const totalMovies = result[0].totalCount[0]?.count || 0;

      const totalPages = Math.ceil(totalMovies / limitNumber);

      return res.status(200).json({

        success: true,
        count: movies.length,
        totalMovies,
        totalPages,
        currentPage: pageNumber,
        movies

      });

    } catch (error) {

      console.log(
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong"
      });
    }
  };

export const getMovieById = async (req, res) => {

    try {

      const { id } =
        req.params;

      const movie =
        await Movie.findById(id)
          .populate(
            "language",
            "name"
          )
          .populate(
            "genre",
            "name"
          )
          .populate({
            path: "cast.actorId",
            select: "name profileImage"
          })

          .populate({
            path: "reviews.user",
            select: "name avatar"
          });

      if (!movie) {

        return res.status(404).json({
          success: false,
          message: "Movie not found"
        });
      }

      return res.status(200).json({
        success: true,
        movie
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      });
    }
};

export const editMovie = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const {
      title,
      description,
      duration,
      language,
      genre,
      releaseDate,
      poster,
      cast,
      director,
      producer,
      trailer
    } = req.body;

    const movie =
      await Movie.findOne({
        _id: id,
        isDeleted: false
      });

    if (!movie) {

      return res.status(404).json({
        success: false,
        message:
          "Movie not found"
      });
    }

    if (!title) {

      return res.status(400).json({
        success: false,
        field: "title",
        message:
          "Movie title field Required"
      });
    }

    if (!duration) {

      return res.status(400).json({
        success: false,
        field: "duration",
        message:
          "Duration field Required"
      });
    }

    let dur = Number(duration);

    if (isNaN(dur)) {

      return res.status(400).json({
        success: false,
        field: "duration",
        message:
          "Duration must be a number"
      });
    }

    if (
      dur < 30 ||
      dur > 500
    ) {

      return res.status(400).json({
        success: false,
        field: "duration",
        message:
          "Duration must be between 30 and 500 minutes"
      });
    }

    if (!releaseDate) {

      return res.status(400).json({
        success: false,
        field: "releaseDate",
        message:
          "Release Date is Required"
      });
    }

    const date =
      new Date(
        releaseDate
      );

    if (
      isNaN(
        date.getTime()
      )
    ) {

      return res.status(400).json({
        success: false,
        field: "releaseDate",
        message:
          "Invalid release date format"
      });
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (date < today) {

      return res.status(400).json({
        success: false,
        field: "releaseDate",
        message:
          "Release date cannot be in the past"
      });
    }

    const maxDate =
      new Date();

    maxDate.setFullYear(
      maxDate.getFullYear() + 5
    );

    if (date > maxDate) {

      return res.status(400).json({
        success: false,
        field: "releaseDate",
        message:
          "Release date is too far in the future"
      });
    }

    if (!director) {

      return res.status(400).json({
        success: false,
        field: "director",
        message:
          "Director field Required"
      });
    }

    if (
      !language ||
      !language.length
    ) {

      return res.status(400).json({
        success: false,
        field: "language",
        message:
          "Please select at least one language."
      });
    }

    if (
      !genre ||
      !genre.length
    ) {

      return res.status(400).json({
        success: false,
        field: "genre",
        message:
          "Please select at least one genre."
      });
    }

    const {
      card,
      banner,
      thumbnail
    } = poster || {};

    if (
      !card ||
      !banner ||
      !thumbnail
    ) {

      return res.status(400).json({
        success: false,
        field: "poster",
        message:
          "Please upload all images"
      });
    }

    const formattedCast =
      (cast || []).map((actor) => {
      
        if (actor._id) {
        
          return {
          
            actorId:
              actor._id,
          
            name: null
          
          };
        }
      
        return {
        
          actorId: null,
        
          name:
            actor.name?.trim() || ""
        
        };
      
    });

    movie.title =
      title;

    movie.description =
      description;

    movie.duration =
      dur;

    movie.language =
      language;

    movie.genre =
      genre;

    movie.releaseDate =
      releaseDate;

    movie.director =
      director;

    movie.producer =
      producer;

    movie.trailer =
      trailer;

    movie.poster = {
      card,
      banner,
      thumbnail
    };

    movie.cast =
      formattedCast;

    await movie.save();

    return res.status(200).json({
      success: true,
      message:
        "Movie updated successfully",
      movie
    });

  } catch (error) {

    console.log(
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong"
    });
  }
};

export const deleteMovie = async (req, res) => {
    try {

        const { id } = req.params;

        const movie = await Movie.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true
            },
            {
                new: true
            }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movie deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });

    }
};

export const updateMovieStatus = async (req, res) => {

    try {

      const { id } = req.params;
      const { status } = req.body;

      const movie = await Movie.findById(id);

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: "Movie not found",
        });
      }

      movie.status = status;

      await movie.save();

      return res.status(200).json({
        success: true,
        message: "Movie status updated",
        movie,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
};

export const bannerFetch = async (req, res) => {
    try {

        const movies = await Movie.aggregate([

                {
                    $match: {
                        isDeleted: false,
                        status: "now_showing"
                    }
                },
                {
                    $addFields: {
                        ratings: {
                            $avg:
                                "$reviews.stars"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "languages",
                        localField:
                            "language",
                        foreignField:
                            "_id",
                        as: "language"
                    }
                },
                {
                    $lookup: {
                        from: "genres",
                        localField:
                            "genre",
                        foreignField:
                            "_id",
                        as: "genre"

                    }
                },
                {
                    $sort: {
                        ratings: -1
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        duration: 1,
                        trailer: 1,
                        status: 1,
                        ratings: 1,
                        language: 1,
                        genre: 1,
                        poster: {
                            banner: 1
                        }
                    }
                },
                {
                    $limit: 5
                }
            ]);

        return res.status(200).json({
            success: true,
            movies
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addReview = async (req, res) => {

    try {

      const { id } = req.params;

      const userId = req.user.id;

      
      const { comments, stars } = req.body;
      
      const user = await User.findById(userId);

      if(!user){
        return res.status(400).json({
          success: false,
          message: "Invalid User id"
        });
      }
      
      if (!comments || !stars) {

        return res.status(400).json({
          success: false,
          message: "Comment and stars required"
        });
      }

      const movie = await Movie.findById(id);

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: "Movie not found"

        });
      }

      const alreadyReviewed = movie.reviews.find((review) => 
            review?.user?.toString?.() ===
            req.user?._id?.toString?.()

        );

      if (alreadyReviewed) {

        return res.status(400).json({

          success: false,

          message:
            "You already reviewed this movie"

        });
      }

      movie.reviews.unshift({
        user: userId,
        comments,
        stars,
      });

      await movie.save();

      const updatedMovie = await Movie.findById(id)

          .populate({path: "reviews.user", select: "name avatar"
          });

      return res.status(200).json({
        success: true,
        movie: updatedMovie
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message

      });

    }
};