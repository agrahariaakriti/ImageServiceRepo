import mongoose from "mongoose";
const DBname = "RBAC";

export const connectDB = async () => {
  const connection = await mongoose.connect(
    `${process.env.mongoose_URI}/${DBname}`,
  );
  console.log(`MongoDB connected: ${connection.connection.host}`);
};
