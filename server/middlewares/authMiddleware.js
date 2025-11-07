import jwt from 'jsonwebtoken';
import { getCachedUser, setCachedUser } from '../utils/tokenCache.js';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const cachedUser = getCachedUser(token);
        if(cachedUser){
            req.user = cachedUser;
            return next();
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = { id: decoded.id, role: decoded.role, username: decoded.username };

        setCachedUser(token, user);
        req.user = user;
        next();
    } catch (error) {
        console.error("[Error]: authMiddleware", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};