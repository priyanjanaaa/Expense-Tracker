import { usersModel } from '../models/usersModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import expensesModel from '../models/expensesModel.js';

dotenv.config();
export const signupRoute=async(req,res)=>{
    try{
        const{name,email,password,confirmPassword}=req.body;
        if(!name || !email ||!password){
           return res.status(400).send("All fields must be filled");
        }
        if(password.length<6){
           return res.status(400).send("Password must be at least 6 characters");
        }

        const existingUser=await usersModel.findOne({email});
        if(existingUser){
            return res.status(401).send("User already exists. Consider logging in")
        }
        if(password!==confirmPassword){
            return res.status(401).send("Confirm password doesnt match.");
        }
        const hashed=await bcrypt.genSalt(10);
        const hashedpwd=await bcrypt.hash(password,hashed);

        const user=await usersModel.create({
            name,
            email,
            password:hashedpwd
        })

        const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET
        )
        res.status(201).json({
            message:"User signed in successfully",
            user:{
                name,
                email
            },
            token
        })



    }catch(e){
        res.status(500).send("Something went wrong");
    }
}

export const LoginRoute=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email||!password){
            return res.status(400).send("Enter all fields");
        }
        const user=await usersModel.findOne({email});
        if(!user){
            return res.status(401).send("No such user consider signing up first.");
        }
        const checked=await bcrypt.compare(password,user.password);
        if(!checked){
            return res.status(401).send("Password doesnt match. Try again!");
        }
        
        const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET
        )

        res.status(200).json({
            message:"Succesfully logged in",
            user:{
                email
            },
            token

        })

    }catch(e){
        res.status(500).send("Server Error");
    }
}

export const expensepostRoute=async(req,res)=>{
    try{
        const{date,category,description,amount}=req.body;
        if(!date || !category||!description||!amount){
            res.status(401).send("All fields have to be filed.");
        }
        const expense=await expensesModel.create({date,category,description,amount});
        res.status(200).json({
            message:"Expense added",
            expense
        })

    }catch(e){
        res.status(500).send("Something went wrong");
    }
}

export const viewexpensesRoute=async(req,res)=>{
    try{
        const expenses=await expensesModel.find().sort({createdAt:-1})
        res.status(200).json(expenses);

    }catch(e){
        res.status(500).send("Server Error");
    }
}