import mongoose from "mongoose";
import AvailabilityModel from "../models/Availability.js";
import AppointmentModel from "../models/Appointment.js";

// Book appointment
export const bookAppointment = async ({studentId, professorId, availabilityId, timeSlotId, notes}) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const availability = await AvailabilityModel.findById(availabilityId).session(session);

        if(!availability){
            await session.abortTransaction();
            return {
                success: false,
                message: 'Availability not found',
            };
        }

        const slot = availability.timeSlots.id(timeSlotId);
        if(!slot) {
            await session.abortTransaction();
            return {
                success: false,
                message: 'Slot is not available',
            };
        }

        if(slot.isBooked){
            await session.abortTransaction();
            return {
                success: false,
                message: 'Slot is already booked',
            }
        }

        const [appointment] = await AppointmentModel.create([{
            professorId,
            studentId,
            availabilityId,
            timeSlotId,
            date: availability.date,
            startTime: slot.startTime,
            status: 'booked',
            notes
        }], { session });

        slot.isBooked = true;
        slot.appointmentId = appointment._id;
        await availability.save({ session });
        await session.commitTransaction();

        return {
            success: true,
            message: 'Appointment booked successfully.',
            data: appointment
        };
    } catch (error) {
        await session.abortTransaction();
        console.error("[Error]: occured while booking appointment: ", error);
        return {
            success: false,
            message: "Internal server error",
        };
    } finally {
        session.endSession();
    }
};


// update Cancel appointment 
export const cancelAppointment = async ({ appointmentId, professorId }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const appointment = await AppointmentModel.findById(appointmentId);
        if(!appointment){
            return {
                success: false,
                message: 'Appointment not found'
            };
        }

        if(appointment.professorId.toString() !== professorId.toString()) {
            return {
                success: false,
                message: "Unauthorized: only the assigned professor can update status",
            };
        }

        if(appointment.status === 'completed'){
            return {
                success: false,
                message: "Appointment is completed already",
            };
        }

        if(appointment.status !== 'booked'){
            return {
                success: false,
                message: "Appointment is not active"
            };
        }

        appointment.status = 'cancelled',
        await appointment.save();

        const availability = await AvailabilityModel.findById(appointment.availabilityId);
        if(availability){
            const slot = availability.timeSlots.id(appointment.timeSlotId);
            if(slot){
                slot.isBooked = false;
                slot.appointmentId = null;
                await availability.save();
            }
        }
        await session.commitTransaction();
        return {
            success: true,
            message: "Appointment cancelled successfully"
        };
    } catch (error) {
        await session.abortTransaction();
        console.error("[Error]: occured while cancelling appointment: ", error);
        return {
            success: false,
            message: "Internal server error",
        };
    } finally {
        session.endSession();
    }
};

// update complete appointment
export const completeAppointment = async ({ appointmentId, professorId }) => {
    try {

        const appointment = await AppointmentModel.findById(appointmentId);
        if(!appointment){
            return {
                success: false,
                message: 'Appoitment not found',
            };
        }

        if(appointment.professorId.toString() !== professorId.toString()){
            return {
                success: false,
                message: 'Unauthorised: only the assigned professor can update status'
            };
        }

        if(appointment.status !== 'booked' || appointment.status === 'cancelled'){
            return {
                success: false,
                message: 'Appointment is not active'
            };
        }

        appointment.status = 'completed';
        await appointment.save();
        return {
            success: true,
            message: 'Appointment marked as completed'
        };
    } catch (error) {
        console.error("[Error]: occured while updated the complete status in appointment: ", error);
        return {
            success: false,
            message: "Internal server error"
        };
    }
};

// fetch all appointments
export const getAppointments = async ({userId, role, status, date, page = 1, limit = 10}) => {
    try {
        const filter = {};
        if (role === 'professor') filter.professorId = userId;
        if (role === 'student') filter.studentId = userId;
        if (status) filter.status = status;
        if (date) filter.date = new Date(date);

        const skip = (page - 1)*limit;

        const appointments = await AppointmentModel.find(filter)
        .select("professorId studentId date startTime status notes") 
        .populate("studentId", "name email")
        .populate("professorId", "name email")
        .sort({ date: 1, startTime: 1 })
        .skip(skip)
        .limit(parseInt(limit));

        const total = await AppointmentModel.countDocuments(filter);

        return {
            success: true,
            message: "Appointments fetched successfully",
            total,
            page,
            pages: Math.ceil(total / limit),
            appointments,
        };
    } catch (error) {
        console.error("[Error]: occured while fetching all appointments: ", error);
        return {
            success: false,
            message: "Internal server error"
        }
    }
};
