const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.send("SpeakerBox Active!"));

app.listen(port, () =>
  console.log(`SpeakerBox is listening at http://localhost:${port}`)
);
