const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const ytdl = require("ytdl-core");
const youtubedl = require('youtube-dl-exec');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

router.get("/parse-url", async (req, res) => {
 
  const { url } = req.query;
  try {
    const info = await ytdl.getInfo(url);
    console.log(info?.videoDetails?.title);
    const videoDetails = info?.videoDetails
    const formats = info?.formats
      .filter(
        (item) => item?.audioCodec !== null && item?.codecs !== 'opus' 
        
      )
    // console.log("formats are here",formats );
//     youtubedl(url, {
//   dumpSingleJson: true,
//   noCheckCertificates: true,
//   noWarnings: true,
//   preferFreeFormats: true,
//   addHeader: [
//     'referer:youtube.com',
//     'user-agent:googlebot'
//   ]

// }).then(output => console.log(output))
    res.send({formats,videoDetails});

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


