export const verifyTheatreOwner = (req, res, next) => {

    try {
        
        if(req.user.role !== "theatre_owner"){
            return res.status(403).json({
                success: false,
                message: "Only Theatre Owner can access this page"
            })
        }

        next()

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}