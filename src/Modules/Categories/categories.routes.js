import { Router } from "express";
import * as controller from "./categories.controller.js";
import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { multerHost } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/index.js";
import { getDocumentByName } from "../../Middlewares/finders.middleware.js";
import { Category } from "../../../DB/Models/index.js";
const categoryRouter = Router(); 

categoryRouter.post(
    "/create",
     multerHost({allowedExtensions: extensions.Images}).single("image"),
     getDocumentByName(Category),
     errorHandler(controller.createCategory)
)


categoryRouter.get("/getCategory", errorHandler(controller.getCategory))    

categoryRouter.put(
    "/update/:_id",
     multerHost({allowedExtensions: extensions.Images}).single("image"),
     getDocumentByName(Category),
     errorHandler(controller.updateCategory)
)


categoryRouter.delete("/delete/:_id",errorHandler(controller.deleteCategory))

export { categoryRouter }