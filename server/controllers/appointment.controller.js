import { bookAppointment, cancelAppointment, completeAppointment, getAppointments } from "../services/appointment.service.js";

export const getAllAppointmentController = async (req, res) => {
    const { status, date, page, limit } = req.query;
    const { id: userId, role } = req.user;

    const result = await getAppointments({ userId, role, status, date, page, limit });
    if(result.success){
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};

export const bookAppointmentController = async (req, res) => {
    const studentId = req.user.id;
    const { professorId, availabilityId, timeSlotId, notes } = req.body;

    const result = await bookAppointment({ studentId, professorId, availabilityId, timeSlotId, notes});
    if(result.success){
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};

export const cancelAppointmentController = async (req, res) => {
    const professorId = req.user.id;
    const { appointmentId } = req.params;

    const result = await cancelAppointment({appointmentId, professorId});
    if(result.success){
        res.status(201).json(result);
    } else {
        res.status(400).json(result);
    }
};

export const completeAppointmentController = async (req, res) => {
    const professorId = req.user.id;
    const { appointmentId } = req.params;

    const result = await completeAppointment({appointmentId, professorId});
    if(result.success){
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};