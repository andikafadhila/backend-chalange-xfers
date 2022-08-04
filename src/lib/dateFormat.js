const dayjs = require("dayjs");
require("dayjs/locale/de");
dayjs.locale("de");
var updateLocale = require("dayjs/plugin/updateLocale");
dayjs.extend(updateLocale);

dayjs.updateLocale("de", {
  months: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
});

const dateFormat = (date) => {
  date = date.slice(0, -6);
  tglArr = date.split(" ");

  let tanggal = tglArr[0];
  let bulan = tglArr[1];
  let tahun = tglArr[2];

  console.log(tanggal, bulan, tahun);

  if (bulan == "Januari") {
    bulan = "01";
  } else if (bulan == "Februari") {
    bulan = "02";
  } else if (bulan == "Maret") {
    bulan = "03";
  } else if (bulan == "April") {
    bulan = "04";
  } else if (bulan == "Mei") {
    bulan = "05";
  } else if (bulan == "Juni") {
    bulan = "06";
  } else if (bulan == "Juli") {
    bulan = "07";
  } else if (bulan == "Agustus") {
    bulan = "08";
  } else if (bulan == "September") {
    bulan = "09";
  } else if (bulan == "Oktober") {
    bulan = "10";
  } else if (bulan == "November") {
    bulan = "11";
  } else if (bulan == "Desember") {
    bulan = "12";
  }

  let formatedDate = `${tahun}-${bulan}-${tanggal}`;

  return formatedDate;
};

module.exports = { dateFormat };
