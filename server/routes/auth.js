import express from 'express';

const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        //Login logic here
    } catch (error) {
        //handle error
    }
});

authRouter.post('/register', (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;

        //Registration logic here
    } catch (error) {
        //handle error
    }
});


export default authRouter;