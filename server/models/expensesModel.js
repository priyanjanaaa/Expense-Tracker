import mongoose from "mongoose";

const expensesSchema=mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    category:{
        type:String,
        required:true

    },
    description:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_info",
        required:true
    }
})

const expensesModel=mongoose.model('expense_info',expensesSchema);
export default expensesModel;