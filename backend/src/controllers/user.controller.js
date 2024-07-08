import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";


const generateAccessTokenAndRefreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

export const registerUser = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        const existUser = await User.findOne({
            $or: [{email}, {username}]
        })

        if(existUser){
            throw new ApiError(409, "User with this email or username already exist")
        }

        const user = await User.create({
            email: email,
            username: username,
            password: password
        });

        const createdUser = await User.findById(user._id).select("-refreshToken -password");

        if(!createdUser){
            throw new ApiError(500, "Somethimg went wrong while registering the user");
        }

        return res.status(201).json({data: createdUser, message: "User register successfully"});

        
    } catch (error) {
        console.log("Error happen while registering user", error);
        next(error);
    }
};


export const loginUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        if (!(email || username)) {
            throw new ApiError(400, "Username or email required");
        }

        const user = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (!user) {
            throw new ApiError(404, "User with email or username does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password");
        }

        const { refreshToken, accessToken } = await generateAccessTokenAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: false,
            secure: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json({ data: loggedInUser, message: "User logged in successfully" });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};


export const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httponly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accesstoken", options)
        .json("user loggedout successfully")

}

