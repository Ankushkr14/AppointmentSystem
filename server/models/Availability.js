import mongoose from "mongoose";

// Time Slot Subschema
const timeSlotSchema = new mongoose.Schema ({
    startTime: { type: Date, required: true },
    isBooked: { type: Boolean, default: false },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null
    } 
})

// Availability Schema
const availabilitySchema = new mongoose.Schema({
    professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: { type: Date, required: true },
    timeSlots: [timeSlotSchema],
}, { timestamps: true });

availabilitySchema.index({ professorId: 1, date: 1 }, { unique: true });

const AvailabilityModel = mongoose.model('Availability', availabilitySchema);

export default AvailabilityModel;