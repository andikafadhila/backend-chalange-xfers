const { dbCon } = require("../connection");
const {
  scrapperService,
  deleteKursService,
  getKursDateRangeService,
  getKursDateRangeSymbolService,
  inputKursService,
  updateKursService,
} = require("../services/kursService");

const scrapperController = async (req, res) => {
  try {
    let result = await scrapperService();

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const deletekursController = async (req, res) => {
  console.log(req.path);
  try {
    let result = await deleteKursService(req.path);

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: error.message || error });
  }
};

const getKursDateRangeSymbolController = async (req, res) => {
  try {
    let result = await getKursDateRangeSymbolService(
      req.query.startdate,
      req.query.enddate,
      req.path
    );

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: error.message || error });
  }
};

const getKursDateRangeController = async (req, res) => {
  try {
    let result = await getKursDateRangeService(
      req.query.startdate,
      req.query.enddate
    );

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: error.message || error });
  }
};

const inputKursController = async (req, res) => {
  try {
    let result = await inputKursService(req.body);

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: error.message || error });
  }
};

const updateKursController = async (req, res) => {
  try {
    let result = await updateKursService(req.body);

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: error.message || error });
  }
};

module.exports = {
  scrapperController,
  deletekursController,
  getKursDateRangeSymbolController,
  getKursDateRangeController,
  inputKursController,
  updateKursController,
};
