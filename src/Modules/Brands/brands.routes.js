import { Router } from "express";
import * as controller from "./brands.controller.js";
import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { multerHost } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/index.js";
import { getDocumentByName } from "../../Middlewares/finders.middleware.js";
import { Brand } from "../../../DB/Models/index.js";
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

export { brandRouter }