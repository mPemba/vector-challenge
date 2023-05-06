const { Builder } = require("selenium-webdriver");
const { Options: ChromeOptions } = require("selenium-webdriver/chrome");
const { Options: FirefoxOptions } = require("selenium-webdriver/firefox");
const { checkForPricesAndTest } = require("./checkForPrices");

const priceOptions = {
  originZip: "78727",
  destinationZip: "94107",
  weight: "25",
  boxSizes: [
    {
      name: "Small",
      length: "16",
      width: "12",
      height: "12",
    },
    {
      name: "Medium",
      length: "22",
      width: "16",
      height: "15",
    },
    {
      name: "Large",
      length: "28",
      width: "15",
      height: "16",
    },
  ],
};

const ffDriver = new Builder()
  .forBrowser("firefox")
  .setFirefoxOptions(new FirefoxOptions().setPageLoadStrategy("normal"))
  .build();

const chromeDriver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(new ChromeOptions().setPageLoadStrategy("normal"))
  .build();

(async function main() {
  checkForPricesAndTest(chromeDriver, priceOptions);
  checkForPricesAndTest(ffDriver, priceOptions);
})();
