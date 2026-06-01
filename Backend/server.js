import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { connectDB } from "./src/Database/db.js";


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
