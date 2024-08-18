import express from "express";
import { config } from "dotenv";

//Middlewares
import { globalResponse } from "./src/Middlewares/error-handling.middleware.js";

//Database Connection
import db_connection from "./DB/connection.js";

// Routes
import * as router from "./src/Modules/index.js";


// Load environment variables from .env file
config();



// Initialize Express App
const app = express(); 
const PORT = process.env.PORT || 5000; 



// Middleware to parse JSON bodies
app.use(express.json());

app.use('/categories', router.categoryRouter);
app.use('/brands', router.brandRouter);
app.use('/products', router.productRouter);
app.use('/sub-categories', router.subCategoryRouter);



// Global Error Handler Middleware
app.use(globalResponse);



// connect to database
db_connection();



app.get("/", (req,res)=>{
    res.send("Hello World");
})



// start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))