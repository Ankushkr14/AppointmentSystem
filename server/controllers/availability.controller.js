import { addTimeSlots, getTimeSlots, removeTimeSlots } from "../services/availability.service.js"

export const addTimeSlot = async (req, res) => {
    try {
        const result = await addTimeSlots({ ...req.body, professorId: req.params.professorId });
        if(result.success) {
            res.status(201).json({
                success: true,
                message: result.message,
                availability: result.availability
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const removeTimeSlot = async (req, res) => {
    try {
        const result = await removeTimeSlots({ ...req.body, professorId: req.params.professorId });
        if(result.success){
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getTimeSlot = async (req, res) => {
    try {
        const result = await getTimeSlots(req.params);
        if(result.success){
            res.status(200).json({
                success: true,
                message: result.message,
                availability: result.availability
            })
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}