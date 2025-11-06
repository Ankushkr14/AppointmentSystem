import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema ({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String,
        enum: ['student','professor','admin'],
        default: 'student'
    },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
