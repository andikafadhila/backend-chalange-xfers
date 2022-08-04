const express = require("express");
const Router = express.Router();

const {
  scrapperController,
  deletekursController,
  getKursDateRangeSymbolController,
  getKursDateRangeController,
  inputKursController,
  updateKursController,
} = require("../controllers/kursController");

Router.get("/indexing", scrapperController);
Router.delete("/kurs/:date", deletekursController);
Router.get("/kurs/:symbol", getKursDateRangeSymbolController);
Router.get("/kurs", getKursDateRangeController);
Router.post("/kurs", inputKursController);
Router.put("/kurs", updateKursController);

module.exports = Router;
