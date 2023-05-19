const express = require("express");
const mongoose = require("mongoose");

const pageRoutes = require("./routes/pageRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();
const port = 8080;

// Connect DB
mongoose
  .connect(
    "mongodb+srv://elnurmagerramov:1234@teacherbase.wou1v.mongodb.net/smarteduDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB database connection successful");
  })
  .catch((err) => {
    console.error("MongoDB database connection error: " + err);
  });

// template engine
app.set("view engine", "ejs");

// middlewares
app.use(express.static("public"));

// routes
app.use("/", pageRoutes);
app.use("/course", courseRoutes);



app.listen(port, () => {
  console.log(`app is runing on ${port} port`);
});