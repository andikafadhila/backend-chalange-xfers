const { dbCon } = require("../connection");
const Scraper = require("../lib/puppeteer");
const puppeteer = require("puppeteer");
const { dateFormat } = require("../lib/dateFormat");
const { intFormat } = require(".././lib/intFormat");
const schedule = require("node-schedule");

const scrapperService = async () => {
  let conn, sql;
  let browser;
  let page;

  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT date FROM kurs WHERE date=curdate()`;
    let [resultDate] = await conn.query(sql);

    if (resultDate.length) {
      throw "Sudah ada data untuk tgl hari ini!";
    }

    browser = await puppeteer.launch({
      headless: true,
    });

    page = await browser.newPage();

    let result = await new Scraper(browser, page).main();

    for (let i = 0; i < result.length; i++) {
      const element = result[i];

      sql = `INSERT INTO e_rate SET ?`;
      let dataErate = {
        beli: intFormat(element[1]),
        jual: intFormat(element[2]),
      };

      let [eRateResult] = await conn.query(sql, dataErate);

      sql = `INSERT INTO tt_counter SET ?`;
      let dataTtCounter = {
        beli: intFormat(element[3]),
        jual: intFormat(element[4]),
      };

      let [ttCounterResult] = await conn.query(sql, dataTtCounter);

      sql = `INSERT INTO bank_notes SET ?`;
      let dataBankNotes = {
        beli: intFormat(element[1]),
        jual: intFormat(element[2]),
      };

      let [bankNotesResult] = await conn.query(sql, dataBankNotes);

      sql = `INSERT INTO kurs SET ?`;
      let dataKurs = {
        symbol: element[0],
        e_rate_id: eRateResult.insertId,
        tt_counter_id: ttCounterResult.insertId,
        bank_notes_id: bankNotesResult.insertId,
        date: dateFormat(element[7]),
      };
      await conn.query(sql, dataKurs);
    }

    await browser.close();
    await conn.commit();
    return { message: "berhasil!", result };
  } catch (error) {
    console.log(error);
    await conn.rollback();
    throw new Error(error || "Network Error");
  } finally {
    conn.release();
  }
};

schedule.scheduleJob("0 16 * * *", () => {
  scrapperService();
});

const deleteKursService = async (date) => {
  let conn, sql;
  date = date.slice(6);

  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT id FROM kurs WHERE date = ?`;
    let [resultKurs] = await conn.query(sql, date);

    if (resultKurs.length == 0) {
      throw "Tidak ada data!";
    }

    console.log(resultKurs);

    sql = `DELETE FROM kurs WHERE date = ?`;
    await conn.query(sql, date);

    for (let i = 0; i < resultKurs.length; i++) {
      const element = resultKurs[i];

      sql = `DELETE FROM e_rate WHERE id = ?`;
      await conn.query(sql, element.id);

      sql = `DELETE FROM bank_notes WHERE id = ?`;
      await conn.query(sql, element.id);

      sql = `DELETE FROM tt_counter WHERE id = ?`;
      await conn.query(sql, element.id);
    }

    await conn.commit();
    return { message: "Berhasil Delete!" };
  } catch (error) {
    console.log(error);
    await conn.rollback();
    throw new Error(error || "Network Error");
  } finally {
    conn.release();
  }
};

const getKursDateRangeSymbolService = async (startDate, endDate, symbol) => {
  let conn, sql;
  symbol = symbol.slice(6);

  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT symbol, date, e_rate.jual e_rate_jual, e_rate.beli e_rate_beli, tt_counter.jual tt_counter_jual, tt_counter.beli tt_counter_beli, bank_notes.jual bank_notes_jual, bank_notes.beli bank_notes_beli FROM kurs
    LEFT JOIN e_rate on kurs.e_rate_id = e_rate.id
    LEFT JOIN tt_counter on kurs.tt_counter_id = tt_counter.id
    LEFT JOIN bank_notes on kurs.bank_notes_id = bank_notes.id
    WHERE kurs.date >= ? AND kurs.date <= ? AND symbol = ?`;

    let [result] = await conn.query(sql, [startDate, endDate, symbol]);

    console.log(result);

    let resArr = [];
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      resArr.push({
        symbol: element.symbol,
        e_rate: {
          jual: element.e_rate_jual,
          beli: element.e_rate_beli,
        },
        tt_counter: {
          jual: element.tt_counter_jual,
          beli: element.tt_counter_beli,
        },
        bank_notes: {
          jual: element.bank_notes_jual,
          beli: element.bank_notes_bual,
        },
        date: "2018-05-16",
      });
    }

    await conn.commit();
    return { result: resArr, message: "Berhasil Get Data!" };
  } catch (error) {
    console.log(error);
    await conn.rollback();
    throw new Error(error || "Network Error");
  } finally {
    conn.release();
  }
};

const getKursDateRangeService = async (startDate, endDate) => {
  let conn, sql;

  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT symbol, date, e_rate.jual e_rate_jual, e_rate.beli e_rate_beli, tt_counter.jual tt_counter_jual, tt_counter.beli tt_counter_beli, bank_notes.jual bank_notes_jual, bank_notes.beli bank_notes_beli FROM kurs
    LEFT JOIN e_rate on kurs.e_rate_id = e_rate.id
    LEFT JOIN tt_counter on kurs.tt_counter_id = tt_counter.id
    LEFT JOIN bank_notes on kurs.bank_notes_id = bank_notes.id
    WHERE kurs.date >= ? AND kurs.date <= ?`;

    let [result] = await conn.query(sql, [startDate, endDate]);

    console.log(result);

    let resArr = [];
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      resArr.push({
        symbol: element.symbol,
        e_rate: {
          jual: element.e_rate_jual,
          beli: element.e_rate_beli,
        },
        tt_counter: {
          jual: element.tt_counter_jual,
          beli: element.tt_counter_beli,
        },
        bank_notes: {
          jual: element.bank_notes_jual,
          beli: element.bank_notes_bual,
        },
        date: "2018-05-16",
      });
    }

    await conn.commit();
    return { result: resArr, message: "Berhasil Get Data!" };
  } catch (error) {
    console.log(error);
    await conn.rollback();
    throw new Error(error || "Network Error");
  } finally {
    conn.release();
  }
};

const inputKursService = async (data) => {
  let conn, sql;
  console.log(data);

  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `INSERT INTO e_rate SET ?`;
    let dataErate = {
      beli: data.e_rate.beli,
      jual: data.e_rate.jual,
    };

    let [eRateResult] = await conn.query(sql, dataErate);

    sql = `INSERT INTO tt_counter SET ?`;
    let dataTtCounter = {
      beli: data.tt_counter.beli,
      jual: data.tt_counter.jual,
    };

    let [ttCounterResult] = await conn.query(sql, dataTtCounter);

    sql = `INSERT INTO bank_notes SET ?`;
    let dataBankNotes = {
      beli: data.bank_notes.beli,
      jual: data.bank_notes.jual,
    };

    let [bankNotesResult] = await conn.query(sql, dataBankNotes);

    sql = `INSERT INTO kurs SET ?`;
    let dataKurs = {
      symbol: data.symbol,
      e_rate_id: eRateResult.insertId,
      tt_counter_id: ttCounterResult.insertId,
      bank_notes_id: bankNotesResult.insertId,
      date: data.date,
    };
    await conn.query(sql, dataKurs);

    await conn.commit();
    return { result: data, message: "Berhasil Post Data!" };
  } catch (error) {
    console.log(error);
    await conn.rollback();
    throw new Error(error || "Network Error");
  } finally {
    conn.release();
  }
};

const updateKursService = async (data) => {
  let conn, sql;
  console.log(data);

  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT id, e_rate_id, tt_counter_id, bank_notes_id FROM kurs WHERE symbol = ? AND date = ?`;
    let [result] = await conn.query(sql, [data.symbol, data.date]);
    if (!result.length) {
      throw "Data tidak ditemukan!";
    }

    let kursId = result[0].id;
    let e_rate_id = result[0].e_rate_id;
    let tt_counter_id = result[0].tt_counter_id;
    let bank_notes_id = result[0].bank_notes_id;

    sql = `UPDATE e_rate SET ? WHERE id = ?`;
    let dataErate = {
      beli: data.e_rate.beli,
      jual: data.e_rate.jual,
    };

    let [eRateResult] = await conn.query(sql, [dataErate, e_rate_id]);

    sql = `UPDATE tt_counter SET ? WHERE id = ?`;
    let dataTtCounter = {
      beli: data.tt_counter.beli,
      jual: data.tt_counter.jual,
    };

    let [ttCounterResult] = await conn.query(sql, [
      dataTtCounter,
      tt_counter_id,
    ]);

    sql = `UPDATE bank_notes SET ? WHERE id = ?`;
    let dataBankNotes = {
      beli: data.bank_notes.beli,
      jual: data.bank_notes.jual,
    };

    let [bankNotesResult] = await conn.query(sql, [
      dataBankNotes,
      bank_notes_id,
    ]);

    sql = `UPDATE kurs SET ? WHERE id = ?`;
    let dataKurs = {
      symbol: data.symbol,
    };
    await conn.query(sql, [dataKurs, kursId]);

    await conn.commit();
    return { result: data, message: "Berhasil Post Data!" };
  } catch (error) {
    console.log(error);
    await conn.rollback();
    throw new Error(error || "Network Error");
  } finally {
    conn.release();
  }
};

module.exports = {
  scrapperService,
  deleteKursService,
  getKursDateRangeSymbolService,
  getKursDateRangeService,
  inputKursService,
  updateKursService,
};
