const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/hello-nodejs", (req, res) => {
  res.send("hello");
});

app.listen(8080, () => {
  console.log("server run");
});
