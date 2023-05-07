const { By, until } = require("selenium-webdriver");
const fs = require("fs");
const { COLORS } = require("./util");
const { generateHtmlReport } = require("./generateHtmlReport");
const resultsDir = "test_results";

module.exports = {
  async checkForPricesAndTest(driver, options) {
    let date = new Date();
    date = `${date.getMonth() + 1
      }-${date.getDate()}-${date.getFullYear()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const results = [];

    try {
      const capabilities = await driver.getCapabilities();
      const browserName = capabilities.getBrowserName();
      const browserVersion = capabilities.getBrowserVersion();

      console.log(
        COLORS.CYAN,
        `Running tests for ${browserName}...`,
        COLORS.RESET
      );

      // Create results and screenshots directory
      fs.mkdirSync(`./${resultsDir}/${date}/screenshots`, { recursive: true });

      // Navigate to the USPS calculator
      await driver.get("https://postcalc.usps.com/");

      // Enter the origin and destination ZIP
      await driver.findElement(By.id("Origin")).sendKeys(options.originZip);
      await driver
        .findElement(By.id("Destination"))
        .sendKeys(options.destinationZip);

      // Select custom dimensions option
      await driver.findElement(By.id("option_4")).click();

      // Enter weight and click continue
      await driver.findElement(By.id("Pounds")).sendKeys(options.weight);
      await driver.findElement(By.id("Ounces")).sendKeys("0");
      await driver.findElement(By.id("option_4")).click();

      // Loop through each box size and test
      for (const boxSize of options.boxSizes) {

        //clear inputs
        await driver.findElement(By.id("Length")).clear();
        await driver.findElement(By.id("Width")).clear();
        await driver.findElement(By.id("Height")).clear();

        // Enter the box dimensions
        await driver.findElement(By.id("Length")).sendKeys(boxSize.length);
        await driver.findElement(By.id("Width")).sendKeys(boxSize.width);
        await driver.findElement(By.id("Height")).sendKeys(boxSize.height);

        // Click continue
        await driver.findElement(By.css('input[value="Continue"]')).click();

        // Wait for the results to load
        await driver.wait(
          until.elementsLocated(By.css("#mail-services-sm-lg .row")),
          10000
        );


        // Search through rows for a header that matches "USPS Retail Ground"
        // and store the Normal delivery time Retail prices
        let list = await driver.findElement(By.css("#mail-services-sm-lg"));
        let rows = await list.findElements(By.css(".row"));

        let retailGroundPrice;

        for (let row of rows) {
          const header = await row.findElement(By.css("h4"));
          const headerText = await header.getAttribute("innerText");
          if (headerText.includes("USPS Retail Ground")) {
            const priceEl = (await row.findElements(By.css(".price")))[2];
            retailGroundPrice = await priceEl.getAttribute("innerText");
          }
        }

        // Parse number from string
        retailGroundPrice = retailGroundPrice.split("$")[1];
        retailGroundPrice = parseFloat(retailGroundPrice);

        const success = retailGroundPrice <= 80;

        // Add result to results array
        results.push({
          success,
          shippingPrice: retailGroundPrice,
          browserName,
          browserVersion,
          result: success ? "Pass" : "Fail",
          originZip: options.originZip,
          destinationZip: options.destinationZip,
          weight: options.weight,
          boxSize: boxSize.name,
        });

        // Take screenshot and write to screenshots dir
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(
          `./${resultsDir}/${date}/screenshots/${browserName} - ${boxSize.name}.png`,
          screenshot,
          "base64"
        );

        // Navigate back and go again
        await driver.navigate().back();
      }

      // Log each result and write to file
      results.forEach((r) => {
        const message = `${browserName} - ${r.boxSize} box - Shipping cost: ${r.shippingPrice}`;

        console.log(
          r.success ? COLORS.GREEN : COLORS.RED,
          r.result,
          COLORS.RESET,
          message
        );
      });

      // Generate HTML report
      const htmlReport = await generateHtmlReport(results, browserName, options);

      // Write HTML report to file
      fs.writeFileSync(
        `./${resultsDir}/${date}/${browserName}Report.html`,
        htmlReport,
        "utf8"
      );

      // Write JSON results to file
      fs.writeFileSync(
        `./${resultsDir}/${date}/${browserName}Results.json`,
        JSON.stringify(results, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error(error);
    } finally {
      await driver.quit();
    }
  },
};
