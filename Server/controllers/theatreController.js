import Theatre from "../models/theatreModel.js";

export const createTheatre = async (req, res) => {

    try {
        
        const {name, city, address, location} = req.body;

        if(!name || !city || !address){
            return res.status(400).json({
                success: false,
                message: "Fill the Empty Fields"
            })
        }

        const {lat, lng} = location;

        let longitude = Number(lng);
        let latitude = Number(lng);

        if(isNaN(longitude) || isNaN(latitude)){
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude"
            })
        }

        const geoLocation = {
            type: "ponit",
            coordinates: [longitude, latitude]
        }

        const theatre = await Theatre.create({
            name, 
            city,
            address,
            location: geoLocation,
            status: "pending",
            ownerId: req.user.id
        })

        return res.status(201).json({
            success: true,
            message: "Theatre Created Successfully",
            theatre
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const getAllTheatre = async (req, res) => {

    try {
        
        const theatres = await Theatre.find();

        if(!theatres){
            return res.status(404).json({
                success: false,
                message: "Theatres is Empty"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Theatre Fetched Successfully",
            theatres
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}