import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {

        let token;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {

            token = authHeader.split(" ")[1];

        }


        if (!token) {
            token =  req.cookies.accessToken;
        }


        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message:
                error.name === "TokenExpiredError"
                    ? "Token expired"
                    : "Unauthorized"
        });
    }
};