import mongoose from "mongoose";
import shortId from "shortid";

const urlSchema = mongoose.Schema({
  oriUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortId.generate,
  },
});

export const Url = mongoose.model("Url", urlSchema);
