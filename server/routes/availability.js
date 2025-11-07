import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { addSlotsSchema, removeSlotsSchema } from '../config/validator.js';
import { addTimeSlot, getTimeSlot, removeTimeSlot } from '../controllers/availability.controller.js';
import { requireProfessor } from '../middlewares/roleMiddleware.js';

const availabilityRouter = express.Router();

availabilityRouter.get('/:professorId', getTimeSlot);
availabilityRouter.post('/slots', requireProfessor, validateBody(addSlotsSchema), addTimeSlot);
availabilityRouter.delete('/slots', requireProfessor, validateBody(removeSlotsSchema), removeTimeSlot);

export default availabilityRouter;