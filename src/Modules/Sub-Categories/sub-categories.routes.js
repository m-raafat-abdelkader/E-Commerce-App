import { Router } from "express";

//Controller
import * as controller from "./sub-categories.controller.js";

//Middlewares
import * as middlewares from "../../Middlewares/index.js";

//Utils
import { extensions } from "../../Utils/index.js";

//Models
import { SubCategory } from "../../../DB/Models/index.js";


// get the required middlewares
const {multerHost, getDocumentByName, errorHandler} = middlewares


const subCategoryRouter = Router(); 


subCategoryRouter.post(
    "/create",
    multerHost({allowedExtensions: extensions.Images}).single("image"),
    getDocumentByName(SubCategory),
    errorHandler(controller.createSubCategory)
)



subCategoryRouter.get("/getSubCategory", errorHandler(controller.getSubCategory))



subCategoryRouter.put(
    "/update/:_id",
    multerHost({allowedExtensions: extensions.Images}).single("image"),
    getDocumentByName(SubCategory),
    errorHandler(controller.updateSubCategory)
)



subCategoryRouter.delete("/delete/:_id", errorHandler(controller.deleteSubCategory))



subCategoryRouter.get("/getAllSubCategories", errorHandler(controller.getAllSubCategories))





export { subCategoryRouter }