const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");


const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

app.get("/:universalURL", (req, res) => {
  res.send("404 URL NOT FOUND");
});

module.exports = app;
