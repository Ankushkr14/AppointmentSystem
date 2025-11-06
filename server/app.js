import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';
import connectDB from './config/database.js';

dotenv.config({
    quiet: true
});
const app = express();
app.use(express.json());
connectDB();

app.use('/api/v1', router);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
