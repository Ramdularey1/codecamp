import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type: String,
        require: true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    }
},{timestamps:true});

userSchema.pre("save", async function(next){
    try {
        if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10)
        next();
        
    } catch (error) {
        console.error("Error hashing Password:", error);
        next(error);
        
    }
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const User = mongoose.model("user",userSchema);
export default User;