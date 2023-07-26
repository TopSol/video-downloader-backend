const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const ytdl = require("ytdl-core");

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
const bodyParser = require('body-parser');

// Middleware to parse JSON data from the request body
app.use(bodyParser.json());
router.get("/parse-url", async (req, res) => {
  // youtubedl("https://www.youtube.com/watch?v=do3teoiyFho", {
  //   format: "bestvideo+bestaudio",
  //   dumpSingleJson: true,
  //   noCheckCertificates: true,
  //   noWarnings: true,
  //   preferFreeFormats: true,
  //   extractAudio: true,
  //   addHeader: ["referer:youtube.com", "user-agent:googlebot"],
  // }).then((output) => {
  //   console.log("type of data is", typeof output);
  //   console.log("keys of data", Object.keys(output));
  //   const formats = output?.formats.map((item) => ({
  //     format: item?.format,
  //     isAudio: item?.audio_ext,
  //   }));
  //   console.log(output?.requested_formats);

  // });
  const { url } = req.body;
  try {
    const info = await ytdl.getInfo(url);
    const formats = info?.formats
      .filter(
        (item) => item?.audioCodec !== null && item?.qualityLabel !== null
      )
    console.log("formats are here",formats );
    res.send(formats.map(item=>{return {url:item.url}}));

    // Find the best format that combines both video and audio (highest audio quality available)
    const bestFormat = ytdl.chooseFormat(info.formats, {
      filter: "audioandvideo",
    });

    if (!bestFormat) {
      throw new Error("No format found with video and audio.");
    }

    console.log("Downloadable URL:", bestFormat);
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


