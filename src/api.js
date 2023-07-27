const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const ytdl = require("ytdl-core");

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

router.get("/parse-url", async (req, res) => {
 
  const { url } = req.query;
  try {
    const info = await ytdl.getInfo(url);
    const formats = info?.formats
      .filter(
        (item) => item?.audioCodec !== null && item?.qualityLabel !== null
      )
    console.log("formats are here",formats );
    res.send(formats);

  } catch (error) {
    console.error("Error getting URL:", error.message);
  }

});

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);


