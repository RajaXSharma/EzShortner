import express from "express";
import dotenv from "dotenv";
import DBCONN from "./DBCONN.js";
const app = express();
dotenv.config();

DBCONN()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("connected db on index.js");
    });
  })
  .catch((err) => {
    console.log("error at db conn on indexjs", err);
  });

  


