import mongoose from "mongoose";

const DBCONN = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/urlShortner`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.log("error at connection on dbconn", error.message);
  }
};

export default DBCONN;
