import mongoose from "mongoose";

const db_connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error in database connection: ", error.message);
  }
};


export default db_connection;