import UserModel from "../models/User.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
        username: user.username,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '7d' });
    return token;
}

export const registerUser = async (data) => {
    try {
        const existingUsername = await UserModel.findOne({ username: data.username });
        if(existingUsername) {
            return {
                success: false,
                message: "Username already registered"
            };
        };

        const existingEmail = await UserModel.findOne({email: data.email});
        if(existingEmail) {
            return {
                success: false,
                message: "Email already registered"
            };
        };

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await UserModel.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: hashedPassword,
            role: data.role
        });
        const token = generateToken(newUser);

        return {
            success: true,
            message: "User registered successfully",
            token: token,
        };
    } catch (error) {
        console.error("Error in registeration:", error);
        return {
            success: false,
            message: "Registration failed due to server error",
        };
    }
};


export const loginUser = async (data) => {
    try {
        const user = await UserModel.findOne({
            username: data.username,
        });

        if(!user) {
            return {
                success: false,
                message: "User not registered",
            };
        }   
        
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if(!isPasswordValid) {
            return {
                success: false,
                message: "Incorrect Password",
            };
        }

        const token = generateToken(user);
        return {
            success: true,
            message: "User login sucessfully",
            token: token
        };

    } catch (error) {
        console.error("Error in login: ", error);
        return {
            success: false,
            message: "Login failed due to server error",
        };
    }
}