import AvailabilityModel from "../models/Availability.js";

// Add time slot in availability table
export const addTimeSlots = async ({professorId, date, timeSlots}) => {
    try {
        const baseDate = new Date(date).toDateString();

        timeSlots = timeSlots
        .map(slot => ({ ...slot, startTime: new Date(slot.startTime) }))
        .filter(slot => new Date(slot.startTime).toDateString() === baseDate);

        if (timeSlots.length === 0) {
            return { 
                success: false, 
                message: "No valid time slots for this date" 
            };
        }

        let existingSlots = await AvailabilityModel.findOne({ professorId, date });

        if (existingSlots) {
            const mergedSlots = [
                ...existingSlots.timeSlots,
                ...timeSlots
            ]
                .filter(
                (slot, index, self) =>
                    index === self.findIndex(s => s.startTime.getTime() === slot.startTime.getTime())
                )
                .sort((a, b) => a.startTime - b.startTime);

            existingSlots.timeSlots = mergedSlots;
            await existingSlots.save();
            return { 
                success: true, 
                message: "Time slots added", 
                availability: existingSlots 
            };
        }

        const newAvailability = await AvailabilityModel.create({
            professorId,
            date,
            timeSlots: timeSlots.sort((a, b) => a.startTime - b.startTime),
        });

        return { 
            success: true, 
            message: "Time slots added", 
            availability: newAvailability 
        };
  } catch (error) {
        console.log("[Error]: occured while adding time slots: ", error);
        return {
            success: false,
            message: "Internal server error",
        };
    }
};

// fetch the details of availability table
export const getTimeSlots = async ({professorId}) => {
    try {
        const availability = await AvailabilityModel.find({professorId}).sort({ date: 1 });
        if(!availability || availability.length === 0){
            return {
                success: true,
                message: "No available time slots",
                availability: []
            };
        }

        return {
            success: true,
            message: "Available time slots",
            availability: availability
        };
    } catch (error) {
        console.log("[Error]: occured while getTimeSlots: ", error);
        return {
            success: false,
            message: "Internal server error",
        };
    }
};

//remove time slot
export const removeTimeSlots = async ({professorId, date, timeSlots}) => {
    try {
        const baseDate = new Date(date).toDateString();
        
        const existingSlots = await AvailabilityModel.findOne({professorId, date});
        if(!existingSlots) {
            return {
                success: false,
                message: "No availability found on this date"
            };
        }

        if(!timeSlots || timeSlots.length === 0) {
            return {
                success: false,
                message: "No time slots provided to remove"
            };
        }

        // Normalize times to remove - handle both string and object formats
        const removeTimes = timeSlots.map(t => {
            const time = typeof t === 'string' ? t : t.startTime;
            return new Date(time).getTime();
        });

        // Filter out the time slots to be removed
        existingSlots.timeSlots = existingSlots.timeSlots.filter(
            slot => !removeTimes.includes(slot.startTime.getTime())
        );

        // If no slots remain, optionally delete the availability record or keep it
        if(existingSlots.timeSlots.length === 0) {
            await AvailabilityModel.deleteOne({ _id: existingSlots._id });
            return { 
                success: true, 
                message: "All time slots removed and availability record deleted", 
            };
        }

        await existingSlots.save();
        return { 
            success: true, 
            message: "Time slots removed", 
            availability: existingSlots
        };
    } catch (error) {
        console.log("[Error]: occured while removing time slot: ", error);
        return {
            success: false,
            message: "Internal server error",
        }
    }
}

