import { Router } from "express";

//Controller
import * as controller from "./categories.controller.js";

//Middlewares
import * as middlewares from "../../Middlewares/index.js";

//Utils
import { extensions } from "../../Utils/index.js";

//Models
import { Category } from "../../../DB/Models/index.js";


// get the required middlewares
const {multerHost, getDocumentByName, errorHandler} = middlewares

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



categoryRouter.get("/getAllCategories", errorHandler(controller.getAllCategories))




export { categoryRouter }