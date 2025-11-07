import { loginUser, registerUser } from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const data = req.body;
        const result = await registerUser(data);
        if(result.success) {
            return res.status(201).json({
                success: true,
                message: result.message,
                token: result.token,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export const login = async (req, res) => {
    try {

        const data = req.body;
        const result = await loginUser(data);
        if(result.success){
            return res.status(200).json({
                success: true,
                message: result.message,
                token: result.token
            });
        } else {
            return res.status(401).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}