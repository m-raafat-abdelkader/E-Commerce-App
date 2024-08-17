import mongoose from "mongoose";
const {Schema, model} = mongoose

const productSchema = new Schema({}, {timestamps: true})


export const Product =  mongoose.models.Product || model("Product", productSchema)