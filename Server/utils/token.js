import jwt from "jsonwebtoken"

export const generateAccessToken = (user) => {
    return jwt.sign(
        {id: user.id, role: user.role, type: user.type},
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: "15m"}
    )
}

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user.id, role: user.role, type: user.type}, 
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: "7d"}
    )
}