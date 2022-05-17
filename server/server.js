const path = require("path");

const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/db/user", require("./routes/userRouts"));
app.use("/db/movie", require("./routes/movieRouts"));

//run client in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html")));
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.listen(PORT, () => "server is running on port: " + PORT);
