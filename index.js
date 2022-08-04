require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const morgan = require("morgan");
const cors = require("cors");
const puppeteer = require("puppeteer");

// morgan
morgan.token("date", function (req, res) {
  return new Date().toString();
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);

//cors
app.use(
  cors({
    exposedHeaders: ["x-total-count", "x-token-access", "x-total-product"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// routes
const { kursRoutes } = require("./src/routes");
app.use("/api", kursRoutes);

//get
app.get("/", (req, res) => {
  res.send("<h1>KURS API</h1>");
});

//listen
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`));
