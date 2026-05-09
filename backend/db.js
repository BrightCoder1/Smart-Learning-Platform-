const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = connectToMongo;