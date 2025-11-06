import mongoose from 'mongoose';

// Appointment Schema
const appointmentSchema = new mongoose.Schema ({ 
    professionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    availabilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability',
        required: true,
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'completed', 'cancelled'],
        default: 'booked',
    },
    notes: { type: String },
}, { timestamps: true });

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel;