import mongoose from 'mongoose';

let isConnecting = false;
let retryCount = 0;
const maxRetries = 2;

const connectDB = async () => {

    if(isConnecting) return;
    isConnecting = true;

    try {
        const response = await mongoose.connect(process.env.DATABASE_URL);
        console.log("[ Database connected ] : ", response.connection.host);
        console.log("[ Database Name ] : ", response.connection.name);
        retryCount = 0;
    } catch ( error) {
        if(retryCount >= maxRetries) {
            console.error("[ Max retries reached ] : Could not connect to database");
            return;
        }
        retryCount++;
        console.warn(`[ Database reconnection ] : retry (${retryCount}/${maxRetries}) in 3 seconds`);
        console.error("[ Database Error ] : ",error.message);
        setTimeout(connectDB, 3000);
    } finally {
        isConnecting = false;
    }
}

// re-attempt to connect DB on failure
mongoose.connection.on('disconnected', ()=> {
    console.warn("[ Database disconnected ] : attempting reconnect...");
    connectDB();
});

export default connectDB;
