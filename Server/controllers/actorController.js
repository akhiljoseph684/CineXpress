import Actor from "../models/actorModel.js";

export const createActor = async (req, res) => {
    try {
        const {name, profileImage, bio} = req.body;

        if(!name){
            return res.status(400).json({
                success: false,
                message: "Fill the Empty Fields"
            })
        }

        const actor = await Actor.create({
            name,
            profileImage,
            bio
        });

        return res.status(201).json({
            success: true,
            message: "Actor Created Successfully",
            actor
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }

}

export const getActors = async (req, res) => {

    try {
        
        const actors = await Actor.find({isDeleted: false});

        if(!actors){
            return res.status(404).json({
                success: false,
                message: "Actors is Empty"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Actors fetched Successfully",
            actors
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const getActorById = async (req, res) => {

    try {
        
        const id = req.params.id;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Id is Not Found"
            })
        }

        const actor = await Actor.findById(id);

        if(!actor){
            return res.status(404).json({
                success: false,
                message: "Invalid Id"
            })
        }
        
        return res.status(200).json({
            success: true,
            message: "Actor Fetched Successfully",
            actor
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const editActor = async (req, res) => {
    try {

        const { id } = req.params;

        const { name, profileImage, bio } = req.body;

        const actor = await Actor.findOne({
            _id: id,
            isDeleted: false
        });

        if (!actor) {
            return res.status(404).json({
                success: false,
                message: "Actor not found"
            });
        }

        if (name) {
            actor.name = name;
        }

        if (profileImage) {
            actor.profileImage = profileImage;
        }

        if (bio) {
            actor.bio = bio;
        }

        await actor.save();

        return res.status(200).json({
            success: true,
            message: "Actor updated successfully",
            actor
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteActor = async (req, res) => {
    try {

        const { id } = req.params;

        const actor = await Actor.findOneAndUpdate(
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

        if (!actor) {
            return res.status(404).json({
                success: false,
                message: "Actor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Actor deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const searchActors = async (req, res) => {
    try {

        const { name } = req.query;

        let filter = {
            isDeleted: false
        };

        if (name?.trim()) {
            filter.name = {
                $regex: name.trim(),
                $options: "i"
            };
        }

        const actors = await Actor.find(filter);

        return res.status(200).json({
            success: true,
            count: actors.length,
            actors
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getMoviesByActor = async (req, res) => {
    try {

        const { id } = req.params;

        const movies = await Movie.aggregate([
            {
                $match: {
                    isDeleted: false,
                    "cast.actorId": id
                }
            },
            {
                $addFields: {
                    avgRating: {
                        $avg: "$ratings.stars"
                    },
                    totalRatings: {
                        $size: "$ratings"
                    }
                }
            },
            {
                $sort: {
                    avgRating: -1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            count: movies.length,
            movies
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};