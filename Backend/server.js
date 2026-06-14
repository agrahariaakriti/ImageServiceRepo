import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { connectDB } from "./src/Database/db.js";
// import "./src/Workers/image.woker.js";

import { workerStratengine } from "./src/Workers/image.woker.js";
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .then(() => {
    console.log("Starting the worker...");
    workerStratengine();
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
