import mongoose from "../global-setup.js";
const {Schema, model} = mongoose

const categorySchema = new Schema({
    name:{
        type: String, 
        required: true,
        trim: true, 
        unique: true 
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false //ToDo
    },
    image: 
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
    }
    

}, {timestamps: true})



export const Category =  mongoose.models.Category || model("Category", categorySchema)