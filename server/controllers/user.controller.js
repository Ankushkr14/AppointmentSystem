import { getProfessorList } from "../services/user.service.js"

export const getAllProfessors = async (req, res) => {
    try {
        const response = await getProfessorList();

        if(!response.success){
            return res.status(404).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch professors'
        });
    }
};
