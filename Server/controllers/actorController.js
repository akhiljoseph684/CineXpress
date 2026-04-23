import Actor from "../models/actorModel.js";

export const createActor = async (req, res) => {
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

}

export const getActors = async (req, res) => {

    try {
        
        const actors = await Actor.find();

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