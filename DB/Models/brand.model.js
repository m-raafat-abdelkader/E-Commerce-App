import mongoose from "mongoose";
const {Schema, model} = mongoose

const brandSchema = new Schema({
    name:{
        type: String, 
        required: true,
        trim: true, 
        unique: true 
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false //ToDo
    },
    logo: 
        {
            secure_url: {
                type: String, 
                required: true
            },
            public_id:{
                type: String,
                required: true, 
                unique: true
            }
        },
    customId:{
        type: String,
        required: true,
        unique: true
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    }
    
}, {timestamps: true})


export const Brand =  mongoose.models.Brand || model("Brand", brandSchema)