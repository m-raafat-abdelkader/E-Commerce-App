import { Mongoose } from "mongoose";
import { ErrorClass } from "../Utils/index.js";



/**
 * @param {Mongoose.model} model - Mongoose model e.g Brand, Category, SubCategory,..
 * @returns {Function} - Middleware function to check if the document exist
 * @description - Check if the document exist in the database with the given name
 */
export const getDocumentByName = (model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    if (name) {
      const document = await model.findOne({ name });
      if (document) {
        return next(
          new ErrorClass(
            `${model.modelName} Document exists with this name`,
            404,
            `${model.modelName} Document exists with this name`
          )
        );
      }
    }
    next();
  };
};






/**
 *
 * @param {Mongoose.model} model - Mongoose model e.g Brand, Category, SubCategory,..
 * @returns {Function} - Middleware function to check if the document exist
 * @description - Check if the document exist in the database with the given ids
 */
export const checkIfIdsExit = (model) => {
  return async (req, res, next) => {
    const { categoryId, subCategoryId, brandId, productId } = req.query;
    let document = null;

    if(model.modelName === 'Product'){
      document = await model.findOne({
          _id: productId,
          categoryId: categoryId,
          subCategoryId: subCategoryId,
      }).populate([
          { path: "categoryId", select: "customId" },
          { path: "subCategoryId", select: "customId" },
      ]);
  
    }


    else if(model.modelName === 'Brand'){
      document = await model.findOne({
        _id: brandId,
        categoryId: categoryId,
        subCategoryId: subCategoryId,
      }).populate([
        { path: "categoryId", select: "customId" },
        { path: "subCategoryId", select: "customId" },
      ]);
  

    }


    else if(model.modelName === 'SubCategory'){
      document = await model.findOne({
        _id: subCategoryId,
        categoryId: categoryId,
      }).populate([
        { path: "categoryId", select: "customId" }
      ])

    }


    else if(model.modelName === 'Category'){
      document = await model.findById(categoryId);
      
    }

    if (!document)
      return next(
        new ErrorClass(`${model.modelName} is not found`, { status: 404 })
      );

    req.document = document;

    next();
  };
};
