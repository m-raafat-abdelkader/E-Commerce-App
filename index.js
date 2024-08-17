import express from "express";
import { config } from "dotenv";

import { globalResponse } from "./src/Middlewares/error-handling.middleware.js";
import db_connection from "./DB/connection.js";
import * as router from "./src/Modules/index.js";

config();

const app = express(); 
const PORT = process.env.PORT || 5000; 

app.use(express.json());

app.use('/categories', router.categoryRouter);
app.use('/brands', router.brandRouter);
app.use('/products', router.productRouter);
app.use('/sub-categories', router.subCategoryRouter);

app.use(globalResponse);

db_connection();

app.get("/", (req,res)=>{
    res.send("Hello World");
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))