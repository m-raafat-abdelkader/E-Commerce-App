import { Router } from "express";
import * as controller from "./sub-categories.controller.js";
import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { multerHost } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/index.js";
import { getDocumentByName } from "../../Middlewares/finders.middleware.js";
import { SubCategory } from "../../../DB/Models/index.js";
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

export { subCategoryRouter }