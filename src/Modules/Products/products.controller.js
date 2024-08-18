import { nanoid } from "nanoid"
import slugify from "slugify"

//Utils
import {uploadFile, ErrorClass, calculateProductPrice, cloudinaryConfig} from "../../Utils/index.js"

//Models
import { Product } from "../../../DB/Models/index.js"



/**
 * @api {post} /products/create  Create a product
 */
export const createProduct = async (req, res, next) => {
    //desructuring req.body
    const {title, overview, specs, price, discountAmount, discountType, stock} = req.body

    //req.files 
    if(!req.files.length)
        return next(new ErrorClass("No Images Uploaded", 400))

    //Ids Check 
    const brand = req.document

    if(!brand) 
        return next(new ErrorClass("No Brand Found", 404))


    //Upload images to cloudinary
    // Access the customIds from the brand
    const brandCustomId = brand.customId;
    const catgeoryCustomId = brand.categoryId.customId;
    const subCategoryCustomId = brand.subCategoryId.customId;

    const customId = nanoid(4);
    const folder = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/Sub-Categories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${customId}`;

    const URLs = []

    for(const file of req.files){
        //upload each file to cloudinary
        const {secure_url, public_id} = await uploadFile({
            file: file.path,
            folder
        })

        URLs.push({secure_url, public_id})
    }

    //prepare product object
    const product = {
        title,
        overview,
        specs: JSON.parse(specs),
        price,
        appliedDiscount: {
            amount: discountAmount,
            type: discountType
        },
        stock,
        Images: {
            URLs,
            customId
        },
        categoryId: brand.categoryId._id,
        subCategoryId: brand.subCategoryId._id,
        brandId: brand._id
    }

    //create product
    const newProduct = await Product.create(product)

    res.status(201).json({
        status: "success",
        message: "Product created successfully",
        data: newProduct
    })
}





/**
 * @api {get} /products/getProduct/:_id  Get Product By Id
 */
export const getProductById = async (req, res, next) => {
    //get the product id
    const {_id} = req.params

    //find the product by id
    const product = await Product.findById(_id)
    if(!product) return next(new ErrorClass("No product found", 404, "No product found"))

    res.status(200).json({
        status: "success",
        message: "Product fetched successfully",
        data: product
    })
}







/**
 * @api {put} /products/update/:_id  Update product
 */
export const updateProduct = async (req, res, next) => {
    //get the product id
    const {_id} = req.params

    //find the product by id
    const product = await Product.findById(_id).populate([
        {path: "categoryId", select: "customId"},
        {path: "subCategoryId", select: "customId"},
        {path: "brandId", select: "customId"},
    ]
    )
    if(!product) return next(new ErrorClass("No product found", 404, "No product found"))
    
    //desructuring req.body
    const {title, overview, badge, specs, price, discountAmount, discountType, stock} = req.body

    //title and slug
    if(title){
        const slug = slugify(title, {replacement: "_",lower: true})
        product.title = title
        product.slug = slug
    }


    // update the product stock, overview, badge, specs
    if (stock) product.stock = stock;
    if (overview) product.overview = overview;
    if (badge) product.badge = badge;
    if (specs) product.specs = JSON.parse(specs);


    //price and discount
    if(price || discountAmount || discountType){
        const newPrice = price || product.price
        const discount = {}
        discount.amount = discountAmount || product.appliedDiscount.amount;
        discount.type = discountType || product.appliedDiscount.type;

        product.appliedPrice = calculateProductPrice(newPrice, discount);

        product.price = newPrice
        product.appliedDiscount = discount

    }



    //Images
    if(req.files.length){ 
        // Access the customIds from the product
        const productCustomId = product.Images.customId;
        const brandCustomId = product.brandId.customId;
        const catgeoryCustomId = product.categoryId.customId;
        const subCategoryCustomId = product.subCategoryId.customId;

        const folder = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/Sub-Categories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${productCustomId}`;

        const URLs = []
        let count = 0
        for(const file of req.files){
            //upload each file to cloudinary
            const publicId = product.Images.URLs[count].public_id
            const splitedPublicId = publicId.split(`${product.Images.customId}/`)[1]
            
            const {secure_url, public_id} = await uploadFile({
                file: file.path,
                folder,
                public_id: splitedPublicId

            })            

            
            URLs.push({secure_url, public_id})

            count++
        }
        
        product.Images.URLs = URLs
    }

    //update product
    const updatedProduct = await product.save()
    
    res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: updatedProduct
    })
}






/**
 * @api {delete} /products/delete/:_id  Delete product
 */
export const deleteProduct = async (req, res, next) => {
    //get the product id
    const {_id} = req.params

    //find the product by id
    const product = await Product.findByIdAndDelete(_id).populate([
        {path: "categoryId", select: "customId"},
        {path: "subCategoryId", select: "customId"},
        {path: "brandId", select: "customId"},
    ])

    if(!product) return next(new ErrorClass("No product found", 404, "No product found"))

    //delete the images from cloudinary
    const productCustomId = product.Images.customId;
    const brandCustomId = product.brandId.customId;
    const catgeoryCustomId = product.categoryId.customId;
    const subCategoryCustomId = product.subCategoryId.customId;

    const productPath = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/Sub-Categories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${productCustomId}`;

    await cloudinaryConfig().api.delete_resources_by_prefix(productPath)
    await cloudinaryConfig().api.delete_folder(productPath)

    res.status(200).json({
        status: "success",
        message: "Product deleted successfully"
    })
}