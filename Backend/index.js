import express from "express";
import dotenv from "dotenv";
import DBCONN from "./DBCONN.js";
import { Url } from "./models/url.model.js";
import multer from "multer";

const app = express();
dotenv.config();
app.use(express.json());
const upload = multer();

DBCONN()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("connected db on index.js");
    });
  })
  .catch((err) => {
    console.log("error at db conn on indexjs", err);
  });

app.post("/", upload.none(), async (req, res) => {
  const { originalUrl } = req.body;

  const exist = await Url.findOne({ oriUrl: originalUrl });

  if (exist) {
    res.json({ shortUrl: exist.shortUrl });
  } else {
    const shortUrl = await Url.create({ oriUrl: originalUrl });
    res.json({ shortUrl: shortUrl.shortUrl });
  }
});

app.get("/:shortedUrl", async (req, res) => {
  const shortedUrl = await Url.findOne({ shortUrl: req.params.shortedUrl });

  if (!shortedUrl) {
    throw new Error("cant find url");
    
  }
  // res.json(req.params)
  // res.json(shortedUrl)
  res.redirect(shortedUrl.oriUrl);
});
