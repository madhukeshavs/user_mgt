import mongoose from 'mongoose';
import { DB_URL } from './enviroment.config.js';

const connectDataBase = async() => {
    try {
        await mongoose.connect(DB_URL)
        console.log("Database connected successfully!")
    } catch (err) {
        console.log("Database connection failed!")
    }
}

export default connectDataBase;