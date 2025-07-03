import mongoose from 'mongoose';

const connectDataBase = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/user_mgt')
        console.log("Database connected successfully!")
    } catch (err) {
        console.log("Database connection failed!")
    }
}

export default connectDataBase;