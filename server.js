const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ShortUrl = require("./models/shortUrl");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://root:Birdys195@cluster0.fesohko.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get("/", async (req, res) => {
  const urls = await ShortUrl.find();

  res.render("index", { urls: urls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shorturl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shorturl });

  if (shortUrl === null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is listening on port 5000`)
);
