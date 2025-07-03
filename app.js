import express from 'express';
import connectDataBase from './src/config/connection.js';
import userRouter from './src/routes/user.routes.js';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ServerPort = process.env.PORT || 8080;




const app = express();
connectDataBase();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


// Create logs directory if it doesn't exist & Create a write stream
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));




app.use("/api/v1/", userRouter)
app.use((req, res) => {
    res.status(404).send({
        status: 404,
        message: "Api not found",
        data: []
    })
})

app.listen(ServerPort, () => {
    console.log(`Server is working on port ${ServerPort}`)
})
