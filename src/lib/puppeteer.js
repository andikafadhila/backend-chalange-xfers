const writeFileSync = require("fs").writeFileSync;

/**
 * @class Scraper
 */
module.exports = class Scraper {
  /**
   * @constructor
   */
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;

    this.result = [];
    this.url = "https://www.bca.co.id/id/informasi/kurs";
  }

  /**
   * @method main
   */
  async main() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });

    this.result = await this.page.evaluate(() =>
      Array.from(document.querySelectorAll("tbody > tr")).map((symbol, i) => [
        Array.from(
          symbol.querySelectorAll(
            `tr:nth-child(${i + 1}) > td.sticky-col.first-col > span > p`
          )
        ).map((x) => x.textContent)[0],
        Array.from(
          symbol.querySelectorAll(
            `tr:nth-child(${i + 1}) > td:nth-child(2) > p`
          )
        ).map((x) => x.textContent)[0],
        Array.from(
          symbol.querySelectorAll(
            `tr:nth-child(${i + 1}) > td:nth-child(3) > p`
          )
        ).map((x) => x.textContent)[0],
        Array.from(
          symbol.querySelectorAll(
            `tr:nth-child(${i + 1}) > td:nth-child(4) > p`
          )
        ).map((x) => x.textContent)[0],
        Array.from(
          symbol.querySelectorAll(
            `tr:nth-child(${i + 1}) > td:nth-child(5) > p`
          )
        ).map((x) => x.textContent)[0],
        Array.from(
          symbol.querySelectorAll(
            `tr:nth-child(${i + 1}) > td:nth-child(6) > p`
          )
        ).map((x) => x.textContent)[0],
        Array.from(
          symbol.querySelectorAll(
            `tr:nth-child(${i + 1}) > td:nth-child(7) > p`
          )
        ).map((x) => x.textContent)[0],
        Array.from(
          document.querySelectorAll(
            `div.col-md-8.col-xs-12.col-sm-12 > div.o-grid-list.o-grid-list--column.active > div.o-kurs-refresh-wrapper.pt-16 > div > span > span.desc-ref-kurs.refresh-date`
          )
        ).map((x) => x.textContent)[0],
      ])
    );

    return this.result;
    // this.writeToJson();
  }

  /**
   * @method writeToJson
   */
  writeToJson() {
    writeFileSync("./data/standings.json", JSON.stringify(this.standings));
  }
};
