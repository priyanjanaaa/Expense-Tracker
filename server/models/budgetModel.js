import mongoose from 'mongoose'
const budgetSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_info",
        required:true
    },
    totalBudget:{
        type:Number,
        required:true
    },
    categoryBudget:[
        {
            categoryId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "category",
                required: true
            },
            limit:{
                type:Number,
                required:true
            }
        }
    ],

    month:{
        type:Number,
        required:true
    },
    year:{
        type:Number,
        required:true
    }
});

export const budgetModel=mongoose.model('budget',budgetSchema);