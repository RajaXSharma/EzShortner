import express from "express";
import dotenv from "dotenv";
import DBCONN from "./DBCONN.js";
import { Url } from "./models/url.model.js";
import multer from "multer";
import cors from "cors"

const app = express();
dotenv.config();
app.use(express.json());
const upload = multer();

app.use(cors());

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
    res.json({
      shortUrl: `https://ez-shortner-api.vercel.app/${exist.shortUrl}`,
    });
  } else {
    const shortUrl = await Url.create({ oriUrl: originalUrl });
    res.json({ shortUrl: `localhost:4000/${shortUrl.shortUrl}` });
  }
});

app.get("/:shortedUrl", async (req, res) => {
  const shortedUrl = await Url.findOne({ shortUrl: req.params.shortedUrl });

  if (!shortedUrl) {
    res.status(404).json({
      error: "link not found",
    });
  }
  // res.json(req.params)
  // res.json(shortedUrl)
  res.redirect(shortedUrl.oriUrl);
});

app.use((req, res, next) => {
  res.status(404).send("404 - Page Not Found");
});
