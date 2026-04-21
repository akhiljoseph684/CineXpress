import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const register = async (req, res) => {

    const  {name, email, password, role, ownerDetails} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "Fill the Empty Fields"
        })
    }

    try {
        let isUpperCase = /[A-Z]/g;
        let isLowerCase = /[a-z]/g;
        let isNumber = /[0-9]/g;
        let validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if(!validEmail.test(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            })
        }


        const existUser = await User.findOne({email});

        if(existUser){
            return res.status(409).json({
                success: false,
                message: "User is Already exists"
            });
        }


        if(!isUpperCase.test(password)){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 1 uppercase letter"
            })
        }

        if(!isLowerCase.test(password)){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 1 lowercase letter"
            })
        }

        if(!isNumber.test(password)){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 1 number"
            })
        }

        if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        let userRole = "user";
        let status = "active";

        if(role === "theatre_owner"){
            userRole = role;
            status = "pending";

            if(!ownerDetails){
                return res.status(400).json({
                    success: false,
                    message: "Fill the empty fields"
                })
            }

            let {businessName,  address} = ownerDetails;

            if(!businessName || !address){
                return res.status(400).json({
                    success: false,
                    message: "Fill the empty fields"
                })
            }

        }

        let provider = "local";


        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role: userRole,
            status,
            provider,
            ownerDetails: role === "theatre_owner" ? ownerDetails : {}
        });

        const accessToken = generateAccessToken({id: user.id, role: user.role})
        const refreshToken = generateRefreshToken({id: user.id, role: user.role})

        res.cookie("refreshtoken",refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            accessToken
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    const  {email, password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Fill the Empty Fields"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        if(user.provider !== "local"){
            return res.status(400).json({
                success: false,
                message: "Please Login with Google"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const accessToken = generateAccessToken({id: user.id, role: user.role})
        const refreshToken = generateRefreshToken({id: user.id, role: user.role})

        res.cookie("refreshtoken",refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken
        })
    } catch (error) {
        
    }
}

export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ 
        success: false,
        message: "Logged out" 
    });
}


export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "No refresh token" 
        });
    }

    try {
        
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
          return res.status(403).json({ 
            success: false,
            message: "Invalid refresh token" 
        });
        }

        const newAccessToken = generateAccessToken({
            id: decoded.id,
            role: decoded.role
        })

        return res.staus(200).json({
            success: true,
            accessToken: newAccessToken
        })

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message
        });
    }
}

