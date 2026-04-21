import jwt from "jsonwebtoken"

export const generateAccessToken = async (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN, {expiresIn: "15m"})
}

export const generateRefreshToken = async (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN, {expiresIn: "7d"})
}