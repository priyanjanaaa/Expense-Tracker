import express, { json } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import {signupRoute,LoginRoute,expensepostRoute,viewexpensesRoute} from './routes/Routes.js'
import { authMiddleware } from './middleware/authMiddleware.js'
dotenv.config();
const PORT=process.env.PORT
const MONGO_URI=process.env.MONGO_URI
mongoose.connect(MONGO_URI);
console.log("Mongoose connected");
const app=express();
app.use(express.json())
app.use(cors());
app.post('/users',signupRoute);
app.post('/login',LoginRoute);
app.post('/expense',authMiddleware,expensepostRoute);
app.get('/expense',authMiddleware,viewexpensesRoute);

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
});

