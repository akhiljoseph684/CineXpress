export const verifyAdmin = (req, res, next) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({
                success: false,
                message: "Only Admin can access this page"
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