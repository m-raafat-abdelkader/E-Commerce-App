import slugify from "slugify"
import { nanoid } from "nanoid"

import {cloudinaryConfig, ErrorClass} from "../../Utils/index.js"
import { Category, SubCategory, Brand } from "../../../DB/Models/index.js"

/**
 * @api {post} /categories/Create  Create a category
 */
export const createCategory = async (req, res, next) => {
    //desructuring req.body
    const {name} = req.body 

    //create slug
    const slug = slugify(name, {replacement: "_",lower: true})

    //cateogry image
    if(!req.file){
        return next(new ErrorClass("please upload an image", 400, "Please upload an image"))
    }

    //upload the image to cloudinary
    const customId = nanoid(4)
    const {secure_url, public_id} = await cloudinaryConfig().uploader.upload(
        req.file.path,
        {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${customId}`,
        }
    )

    //prepare category object 
    const category = {
        name,
        slug,
        image: {
            secure_url,
            public_id
        },
        customId
    }

    //create category
    const newCategory = await Category.create(category)

    res.status(201).json({
        status: "success",
        message: "Category created successfully",
        data: {
            newCategory
        }
    })

}


/**
 * @api {get} /categories/getCategory Get category by name or id or slug
 */

export const getCategory = async (req, res, next) => {
    const {id, name, slug} =  req.query 
    const queryFilter = {}

    // check if the query params are present
    if(id) queryFilter._id = id
    if(name) queryFilter.name = name
    if(slug) queryFilter.slug = slug

    //find the category
    const category = await Category.findOne(queryFilter)
    if(!category) return next(new ErrorClass("No category found", 404, "No category found"))

    res.status(200).json({
        status: "success",
        message: "Category found successfully",
        data: { 
            category
        }    
    })
}


/**
 * @api {put} /categories/update/:_id  Update a category
 */

export const updateCategory = async (req, res, next) => {
    //get the category id
    const {_id} = req.params
    
    //find the category by id
    const category = await Category.findById(_id)
    if(!category) return next(new ErrorClass("No category found", 404, "No category found"))
    
    const {name}  = req.body

    //name of the category
    if(name){
        const slug = slugify(name, {replacement: "_",lower: true})
        category.name = name
        category.slug = slug
    }

    //update the image of the category
    if(req.file){
        const splitedPublicId = category.image.public_id.split(`${category.customId}/`)[1]
        const {secure_url} = await cloudinaryConfig().uploader.upload(
            req.file.path,
            {
            folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`,
            public_id: splitedPublicId
            }
        )
       category.image.secure_url = secure_url

    }

    await category.save()

    res.status(200).json({
        status: "success",
        message: "Category updated successfully",
        data: {
            category
        }
    })
    
}


/**
 * @api {delete} /categories/delete/:_id  Delete a category
 */

export const deleteCategory = async (req, res, next) => {
    //get the category id
    const {_id} = req.params
    
    //find the category by id
    const category = await Category.findByIdAndDelete(_id)
    if(!category) return next(new ErrorClass("No category found", 404, "No category found"))
    
    //delete the image from cloudinary
    const categoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`
    await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath)
    await cloudinaryConfig().api.delete_folder(categoryPath)

    //delete sub-categories of the category
    const deletedSubCategories = await SubCategory.deleteMany({categoryId: category._id})

    // check if subcategories are deleted already
    if(deletedSubCategories.deletedCount){
        //delete brands of the category
        await Brand.deleteMany({CategoryId: category._id})

        //TODO: delete products of the category
    }
    res.status(200).json({
        status: "success",
        message: "Category deleted successfully"
    })
}