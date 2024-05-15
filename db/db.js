import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
  } catch (err) {
    console.log("Error connecting to database", err);
  }
};

export default connect;
