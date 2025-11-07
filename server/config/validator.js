import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty':'Name is required',
        'string.min':'Name must have at least 3 characters',
    }),
    username: Joi.string().required().messages({
        'string.empty':'Username is required',
    }),
    email: Joi.string().email().required().messages({
        'string.empty':'Email is required',
        'string.email':'Invalid email address',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty':'Password is required',
        'string.min':'Password must have at least 6 characters',
    }),
    role: Joi.string().required().messages({
        'string.empty':'Role is required'
    }),
});

export const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.empty':'Username is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty':'Password is required',
        'string.min':'Password must have at least 6 characters',
    })
});

export const addSlotsSchema = Joi.object({
    date: Joi.date().required().messages({
        'string.empty':'Date is required'
    }),
    timeSlots: Joi.array().items(
        Joi.object({
        startTime: Joi.date().required(),
        isBooked: Joi.boolean().optional()
        })
    ).min(1).required().messages({
        'string.empty':'At least 1 time slot is required'
    })  
});

export const removeSlotsSchema = Joi.object({
    date: Joi.date().required().messages({
        'string.empty':'Date is required'
    }),
    timeSlots: Joi.array().items(
        Joi.object({
            startTime: Joi.date().required()
        })
    ).min(1).required().messages({
        'string.empty':'At least 1 time slot is required'
    })        
});

export const getAvailabilitySchema = Joi.object({
    professorId: Joi.string().required().messages({
        "string.empty": "Professor Id is required",
    })
});