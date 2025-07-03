import express from 'express';
import { ServerPort } from './src/utility/constant.js';
import connectDataBase from './src/config/connection.js';
import userRouter from './src/routes/user.routes.js';



const app = express();
connectDataBase();
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use("/", userRouter)
app.use((req, res)=>{
    res.status(404).send({
        status: 404,
        message:"Api not found",
        data:[]
    })
})

app.listen(ServerPort, ()=>{
    console.log(`Server is working on port ${ServerPort}`)
})
