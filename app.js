const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

const connectDB= async ()=>{
  mongoose
  .connect(
    "mongodb+srv://Hasan1971:"
    +process.env.MONGO_ATLAS_PW+
    "@cluster0.2greaqi.mongodb.net/"+process.env.DB+"?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("MongoDb Connection failed!");
  });
}
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));

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
