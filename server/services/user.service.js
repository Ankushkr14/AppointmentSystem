import UserModel from "../models/User.js";

export const getProfessorList = async () => {
    try {
        const result = await UserModel.find({role: 'professor'}, {password: 0});

        if(!result || result.length === 0){
            return {
                success: false,
                message: "No Professor data is available"
            };
        }

        return {
            success: true,
            message: 'Professors data fetched successfully',
            data: result
        };
    } catch (error) {
        console.error("[Error]: occured while fetching professorList: ",error);
        return {
            success: false,
            message: "Internal server error"
        }
    }
}