import express from 'express';
import { getAllProfessors } from '../controllers/user.controller.js';

const userRoute = express.Router();

userRoute.get('/professors', getAllProfessors);

export default userRoute;