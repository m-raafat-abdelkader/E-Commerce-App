import mongoose from "../global-setup.js";

// Utils
import {
    Badges,
    DiscountType,
    calculateProductPrice,
  } from "../../src/Utils/index.js";

import slugify from "slugify";

const {Schema, model} = mongoose

const productSchema = new Schema({
    //Strings Section 
    title:{
        type: String, 
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        default: function () {
            return slugify(this.title, { lower: true, replacement: "_" });
        }
    },
    overview: String,
    specs: Object, //Map of Strings
    badge:{
        type: String,
        enum: Object.values(Badges),
    },

    //Numbers Section
    price:{
        type: Number,
        required: true,
        min: 50
    },
    appliedDiscount:{
        amount:{
            type: Number,
            min: 0,
            default: 0
        },
        type:{
            type: String,
            enum: Object.values(DiscountType),
            default: DiscountType.PERCENTAGE
        }
    },
    appliedPrice:{
        type: Number,
        required: true,
        default: function () {
            return calculateProductPrice(this.price, this.appliedDiscount)
        }
    },
    stock:{
        type: Number,
        required: true,
        min: 10
    },
    rating:{
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    
    //Images Section
    Images:{
        URLs: [{
            secure_url: {
                type: String, 
                required: true
            },
            public_id:{
                type: String,
                required: true, 
                unique: true
            }
        }],
        customId:{
            type: String,
            required: true,
            unique: true
        }
    },

    //Ids Section
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    brandId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false //ToDo
    }
}, {timestamps: true})


export const Product =  mongoose.models.Product || model("Product", productSchema)