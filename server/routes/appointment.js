import express from 'express';
import { bookAppointmentController, cancelAppointmentController, completeAppointmentController, getAllAppointmentController } from '../controllers/appointment.controller.js';
import { validateBody } from '../middlewares/validateBody.js';
import { bookAppointmentSchema, cancelAppointmentSchema, completeAppointmentSchema, getAppointmentsSchema } from '../config/validator.js';

const appointmentRoute = express.Router();

appointmentRoute.get('/', validateBody(getAppointmentsSchema), getAllAppointmentController);
appointmentRoute.post('/book', validateBody(bookAppointmentSchema), bookAppointmentController);
appointmentRoute.put('/cancel/:appointmentId', validateBody(cancelAppointmentSchema), cancelAppointmentController);
appointmentRoute.put('/complete/:appointmentId', validateBody(completeAppointmentSchema), completeAppointmentController);

export default appointmentRoute;