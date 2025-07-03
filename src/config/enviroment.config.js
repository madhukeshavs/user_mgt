import dotenv from 'dotenv';
dotenv.config();

export const ServerPort = process.env.PORT || 8080;
export const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/user_mgt';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
