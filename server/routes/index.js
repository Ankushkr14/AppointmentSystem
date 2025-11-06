import express from 'express';
import authRouter from './auth.js';
const router = express.Router();

router.get('/health-check', (req, res)=> {
    res.status(200).json({
        success: true,
        message: 'Server API is active'
    })
});

// Authentication routes
router.use('/auth', authRouter);

export default router;
