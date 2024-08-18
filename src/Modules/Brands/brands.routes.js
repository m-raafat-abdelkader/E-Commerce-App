import { Router } from "express";

//Controller
import * as controller from "./brands.controller.js";

//Middlewares
import * as middlewares from "../../Middlewares/index.js";

//Utils
import { extensions } from "../../Utils/index.js";

//Models
import { Brand } from "../../../DB/Models/index.js";


// get the required middlewares
const {multerHost, getDocumentByName, errorHandler} = middlewares

const brandRouter = Router(); 



brandRouter.post(
    "/create",
     multerHost({allowedExtensions: extensions.Images}).single("image"),
     getDocumentByName(Brand),
     errorHandler(controller.createBrand)
)



brandRouter.get("/getBrand", errorHandler(controller.getBrand))


brandRouter.put(
    "/update/:_id",
     multerHost({allowedExtensions: extensions.Images}).single("image"),
     getDocumentByName(Brand),
     errorHandler(controller.updateBrand)
)



brandRouter.delete("/delete/:_id",errorHandler(controller.deleteBrand))



brandRouter.get("/getSpecificBrands", errorHandler(controller.getSpecificBrands))




export { brandRouter }