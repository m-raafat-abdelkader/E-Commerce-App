import slugify from "slugify"
import { nanoid } from "nanoid"

import {cloudinaryConfig, ErrorClass} from "../../Utils/index.js"
import { Category, SubCategory, Brand } from "../../../DB/Models/index.js"

/**
 * @api {post} /sub-categories/Create Create a sub-category
 */
export const createSubCategory = async (req, res, next) => {
    //Check if the category exists
    const category = await Category.findById(req.query.categoryId)
    if(!category) return next(new ErrorClass("No category found", 404, "No category found"))

    //create slug
    const {name} = req.body
    const slug = slugify(name, {replacement: "_",lower: true})

    //upload the image to cloudinary
    if(!req.file){
        return next(new ErrorClass("please upload an image", 400, "Please upload an image"))
    }
    const customId = nanoid(4)
    const {secure_url, public_id} = await cloudinaryConfig().uploader.upload(req.file.path,
        {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}/Sub-Categories/${customId}`
        }
    )    

    //prepare sub-category object 
    const subCategory = {
        name,
        slug,
        image: {
            secure_url,
            public_id
        },
        customId,
        categoryId: category._id
    }

    //create sub-category
    const newSubCategory = await SubCategory.create(subCategory)

    res.status(201).json({
        status: "success",  
        message: "Sub-category created successfully",
        data: {
            newSubCategory
        }
    })
}



/**
 * @api {get} /sub-categories/getSubCategory Get sub-category by name or id or slug
 */

export const getSubCategory = async (req, res, next) => {
    const {id, name, slug} =  req.query 
    const queryFilter = {}

    // check if the query params are present
    if(id) queryFilter._id = id
    if(name) queryFilter.name = name
    if(slug) queryFilter.slug = slug

    //find the sub-category
    const subCategory = await SubCategory.findOne(queryFilter)
    if(!subCategory) return next(new ErrorClass("No sub-category found", 404, "No sub-category found"))

    res.status(200).json({
        status: "success",
        message: "Sub-Category found successfully",
        data: { 
            subCategory
        }    
    })
}



/**
 * @api {put} /sub-categories/update/:_id  Update a sub-category
 */
export const updateSubCategory = async (req, res, next) => {
    //get the sub-category id
    const {_id} = req.params
    
    //find the sub-category by id
    const subCategory = await SubCategory.findById(_id).populate("categoryId")
    if(!subCategory) return next(new ErrorClass("No sub-category found", 404, "No sub-category found"))
    
    const {name}  = req.body

    //name of the sub-category
    if(name){
        const slug = slugify(name, {replacement: "_",lower: true})
        subCategory.name = name
        subCategory.slug = slug
    }

    //update the image of the sub-category
    if(req.file){
        const splitedPublicId = subCategory.image.public_id.split(`${subCategory.customId}/`)[1]
        const {secure_url} = await cloudinaryConfig().uploader.upload(
            req.file.path,
            {
            folder: `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/Sub-Categories/${subCategory.customId}`,
            public_id: splitedPublicId
            }
        )
       subCategory.image.secure_url = secure_url

    }

    await subCategory.save()

    res.status(200).json({
        status: "success",
        message: "sub-Category updated successfully",
        data: {
            subCategory
        }
    })
    
}




/**
 * @api {delete} /sub-categories/delete/:_id  Delete a sub-category
 */

export const deleteSubCategory = async (req, res, next) => {
    //get the sub-category id
    const {_id} = req.params
    
    //find the sub-category by id
    const subCategory = await SubCategory.findByIdAndDelete(_id).populate("categoryId")
    if(!subCategory) return next(new ErrorClass("No subCategory found", 404, "No subCategory found"))
    
    //delete the image from cloudinary
    const subCategoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/Sub-Categories/${subCategory.customId}`
    await cloudinaryConfig().api.delete_resources_by_prefix(subCategoryPath)
    await cloudinaryConfig().api.delete_folder(subCategoryPath)

    //delete the brand of the sub-category
    await Brand.deleteMany({subCategoryId: subCategory._id})

    res.status(200).json({
        status: "success",
        message: "Sub-Category deleted successfully"
    })
}