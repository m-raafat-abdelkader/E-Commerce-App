import slugify from "slugify"
import { nanoid } from "nanoid"

import {cloudinaryConfig, ErrorClass} from "../../Utils/index.js"
import { Brand, SubCategory } from "../../../DB/Models/index.js"

/**
 * @api {post} /brands/Create  Create a brand
 */
export const createBrand = async (req, res, next) => {
    const {categoryId, subCategoryId} = req.query
    const subCategory = await SubCategory.findOne({
        _id: subCategoryId,
        categoryId
    }).populate("categoryId")

    if(!subCategory) return next(new ErrorClass("No sub-category found", 404, "No sub-category found"))

    //create slug
    const {name} = req.body 
    const slug = slugify(name, {replacement: "_",lower: true})

    //brand image
    if(!req.file){
        return next(new ErrorClass("please upload an image", 400, "Please upload an image"))
    }

    //upload the logo to cloudinary
    const customId = nanoid(4)
    const {secure_url, public_id} = await cloudinaryConfig().uploader.upload(
        req.file.path,
        {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/Sub-Categories/${subCategory.customId}/Brands/${customId}`,
        }
    )

    //prepare brand object 
    const brand = {
        name,
        slug,
        logo: {
            secure_url,
            public_id
        },
        customId,
        categoryId: subCategory.categoryId._id,
        subCategoryId: subCategory._id
    }

    //create brand
    const newBrand = await Brand.create(brand)

    res.status(201).json({
        status: "success",
        message: "Brand created successfully",
        data: {
            newBrand
        }
    })

}


/**
 * @api {get} /brands/getBrand Get brand by name or id or slug
 */

export const getBrand = async (req, res, next) => {
    const {id, name, slug} =  req.query 
    const queryFilter = {}

    // check if the query params are present
    if(id) queryFilter._id = id
    if(name) queryFilter.name = name
    if(slug) queryFilter.slug = slug

    //find the brand
    const brand = await Brand.findOne(queryFilter)
    if(!brand) return next(new ErrorClass("No brand found", 404, "No brand found"))

    res.status(200).json({
        status: "success",
        message: "Brand found successfully",
        data: { 
            brand
        }    
    })
}


/**
 * @api {put} /brands/update/:_id  Update a brand
 */

export const updateBrand = async (req, res, next) => {
    //get the brand id
    const {_id} = req.params
    
    //find the brand by id
    const brand = await Brand.findById(_id).populate("categoryId subCategoryId")
    if(!brand) return next(new ErrorClass("No brand found", 404, "No brand found"))
    
    const {name}  = req.body

    //name of the brand
    if(name){
        const slug = slugify(name, {replacement: "_",lower: true})
        brand.name = name
        brand.slug = slug
    }

    //update the logo of the brand
    if(req.file){
        const splitedPublicId = brand.logo.public_id.split(`${brand.customId}/`)[1]
        const {secure_url} = await cloudinaryConfig().uploader.upload(
            req.file.path,
            {
            folder: `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/Sub-Categories/${brand.subCategoryId.customId}/Brands/${brand.customId}`,
            public_id: splitedPublicId
            }
        )
       brand.logo.secure_url = secure_url

    }

    await brand.save()

    res.status(200).json({
        status: "success",
        message: "Brand updated successfully",
        data: {
            brand
        }
    })
    
}


/**
 * @api {delete} /brands/delete/:_id  Delete a brand
 */

export const deleteBrand = async (req, res, next) => {
    //get the brand id
    const {_id} = req.params
    
    //find the brand by id
    const brand = await Brand.findByIdAndDelete(_id).populate("categoryId subCategoryId")
    if(!brand) return next(new ErrorClass("No brand found", 404, "No brand found"))
    
    //delete the image from cloudinary
    const brandPath = `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/Sub-Categories/${brand.subCategoryId.customId}/Brands/${brand.customId}`
    await cloudinaryConfig().api.delete_resources_by_prefix(brandPath)
    await cloudinaryConfig().api.delete_folder(brandPath)

    //TODO: delete products 

    
    res.status(200).json({
        status: "success",
        message: "Brand deleted successfully"
    })
}