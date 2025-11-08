import express from 'express';
import { bookAppointmentController, cancelAppointmentController, completeAppointmentController, getAllAppointmentController } from '../controllers/appointment.controller.js';
import { validateBody } from '../middlewares/validateBody.js';
import { bookAppointmentSchema, cancelAppointmentSchema, completeAppointmentSchema, getAppointmentsSchema } from '../config/validator.js';
import { requireProfessor, requireStudent } from '../middlewares/roleMiddleware.js';

const appointmentRoute = express.Router();

appointmentRoute.get('/', validateBody(getAppointmentsSchema), getAllAppointmentController);
appointmentRoute.post('/book',requireStudent, validateBody(bookAppointmentSchema), bookAppointmentController);
appointmentRoute.put('/cancel/:appointmentId', requireProfessor, validateBody(cancelAppointmentSchema), cancelAppointmentController);
appointmentRoute.put('/complete/:appointmentId', requireProfessor, validateBody(completeAppointmentSchema), completeAppointmentController);

export default appointmentRoute;