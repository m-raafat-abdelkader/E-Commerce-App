import { Router } from "express";

//Controller
import * as controller from "./products.controller.js";

//Middlewares
import * as middlewares from "../../Middlewares/index.js";

//Models
import { Brand} from "../../../DB/Models/index.js";

//Utils
import { extensions } from "../../Utils/index.js";


// get the required middlewares
const {multerHost, checkIfIdsExit,  errorHandler} = middlewares

const productRouter = Router(); 


productRouter.post(
    "/create",
    multerHost({allowedExtensions: extensions.Images}).array("images", 5),
    checkIfIdsExit(Brand),
    errorHandler(controller.createProduct)
)


productRouter.get("/getProduct/:_id", errorHandler(controller.getProductById))


productRouter.put(
    "/update/:_id",
    multerHost({allowedExtensions: extensions.Images}).array("images", 5),
    errorHandler(controller.updateProduct)
)

productRouter.delete("/delete/:_id", errorHandler(controller.deleteProduct))


export { productRouter }