import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, registerSchema } from '../config/validator.js';
import { register, login } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/register', validateBody(registerSchema), register);

export default authRouter;