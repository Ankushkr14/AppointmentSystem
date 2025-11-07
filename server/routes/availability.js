import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { validateParams } from '../middlewares/validateParams.js';
import { addSlotsSchema, getAvailabilitySchema, removeSlotsSchema } from '../config/validator.js';
import { addTimeSlot, getTimeSlot, removeTimeSlot } from '../controllers/availability.controller.js';

const availabilityRouter = express.Router();

availabilityRouter.get('/:professorId', validateParams(getAvailabilitySchema), getTimeSlot);
availabilityRouter.post('/:professorId/timeslots', validateParams(getAvailabilitySchema), validateBody(addSlotsSchema), addTimeSlot);
availabilityRouter.delete('/:professorId/timeslots', validateParams(getAvailabilitySchema), validateBody(removeSlotsSchema), removeTimeSlot);

export default availabilityRouter;