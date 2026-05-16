import Theatre from "../models/theatreModel.js";

export const createTheatre = async (req, res) => {

    try {

        const {
            name,
            city,
            address,
            location,
            bannerImage,
            gallery

        } = req.body;


        if (!name || !city || !address || !location) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });

        }

        if (!bannerImage) {

            return res.status(400).json({
                success: false,
                message: "Please upload banner image"

            });

        }

        const { lat, lng } = location;

        const longitude = Number(lng);

        const latitude = Number(lat);

        if (isNaN(longitude) || isNaN(latitude)) {

            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude"
            });

        }

        const geoLocation = {

            type: "Point",
            coordinates: [
                longitude,
                latitude
            ]

        };


        const theatre = await Theatre.create({
                name,
                city,
                address,
                bannerImage,
                gallery: gallery || [],
                location: geoLocation,
                status: "pending",
                ownerId: req.user.id,
                isDeleted: false
            });

        return res.status(201).json({
            success: true,
            message: "Theatre created successfully", 
            theatre
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

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

export const editTheatre = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            name,

            city,

            address,

            bannerImage,

            gallery,

            location

        } = req.body;

        /* ---------- FIND THEATRE ---------- */

        const theatre =
            await Theatre.findById(id);

        if (!theatre) {

            return res.status(404).json({

                success: false,

                message:
                    "Theatre not found"

            });

        }

        /* ---------- OWNER CHECK ---------- */

        if (

            theatre.ownerId.toString() !==
            req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Unauthorized"

            });

        }

        /* ---------- LOCATION ---------- */

        let geoLocation =
            theatre.location;

        if (location) {

            const longitude =
                Number(location.lng);

            const latitude =
                Number(location.lat);

            if (

                isNaN(longitude) ||

                isNaN(latitude)

            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid latitude or longitude"

                });

            }

            geoLocation = {

                type: "Point",

                coordinates: [

                    longitude,

                    latitude

                ]

            };

        }

        /* ---------- UPDATE ---------- */

        theatre.name =
            name || theatre.name;

        theatre.city =
            city || theatre.city;

        theatre.address =
            address || theatre.address;

        theatre.bannerImage =
            bannerImage ||
            theatre.bannerImage;

        theatre.gallery =
            gallery ||
            theatre.gallery;

        theatre.location =
            geoLocation;

        await theatre.save();

        /* ---------- RESPONSE ---------- */

        return res.status(200).json({

            success: true,

            message:
                "Theatre updated successfully",

            theatre

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const getTheatreById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if(!id){
            return res.status(404).json({
                success: false,
                message: 'Id is not found'
            })
        }
        
        const theatre = await Theatre.findById(id);
        
        if(!theatre){
            return res.status(404).json({
                success: false,
                message: "Theatre is Not found"
            })
        }
        
        return res.status(200).json({
            success: true,
            message: "Theatre fetched successfully",
            theatre
        });
        
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getTheatresByOwner = async (req, res) => {

    try {

        const { id } = req.user;

        if (!id) {

            return res.status(404).json({

                success: false,

                message: "Id not found"

            });

        }

        const theatres = await Theatre.find({
            ownerId: id,
            isDeleted: false
        });


        if(!theatres.length){
            return res.status(404).json({
                success: false,
                message: "No theatre is found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Theatres fetched successfully",
            theatres
        });

    } catch (error) {


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteTheatre = async (req, res) => {
    try {
        
        const { id } = req.params;

        if(!id){
            return res.status(404).json({
                success: false,
                message: "Id is not found"
            })
        }

        const theatre = await Theatre.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true
            },
            {
                returnDocument: "after"
            }
        );

        if(!theatre){
            return res.status(404).json({
                success: false,
                message: "Theatre is not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Theatre deleted Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}