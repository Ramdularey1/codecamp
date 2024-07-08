import User from "../models/User.model.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req, res, next) => {
    console.log(req.cookies);
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        
        if (!token) {
            throw new ApiError(401, "Unauthorization request")
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid accessToken")
        }

        req.user = user;

        return next();

    } catch (error) {
        return res.status(401).json(error?.message || "Invalid Access Token")
    }

}