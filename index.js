const { Builder, By, until } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
// const { Options: SafariOptions } = require('selenium-webdriver/safari');
// const edge = require('selenium-webdriver/edge')
const fs = require('fs');


// Set up the driver
// const safariDriver = new Builder()
//   .forBrowser('safari')
//   .setSafariOptions(new SafariOptions().setTechnologyPreview(true))
//   .build();

  const chromeDriver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new ChromeOptions().setPageLoadStrategy('normal'))
  .build();

  // let options = new edge.Options();
  // const edgeDriver = new Builder()
  //   .forBrowser('edge')
  //   .setEdgeOptions(options)
  //   .setEdgeService(new edge.ServiceBuilder(edge.Options.binary))
  //   .build();


// Set the test data
const originZip = '78727';
const destinationZip = '94107';
// const shippingDate = 'June 1, 2023';
const weight = '25';

const boxSizes = [
  {
    name: 'Small',
    length: '16',
    width: '12',
    height: '12',
  },
  {
    name: 'Medium',
    length: '22',
    width: '16',
    height: '15',
  },
  {
    name: 'Large',
    length: '28',
    width: '15',
    height: '16',
  },
];

(async function main() {
  // Promise.all([
    // checkForPrices(safariDriver),
    checkForPrices(chromeDriver)
    // checkForPrices(edgeDriver)
  // ])
})()

// Define the test case
async function checkForPrices(driver) {
  try {
    // Select the shipping date
    // await driver.findElement(By.id('shipping-date')).sendKeys(shippingDate);

    // Navigate to the USPS Retail Postage Calculator website
    await driver.get('https://postcalc.usps.com/');

    // Enter the origin and destination ZIP codes
    await driver.findElement(By.id('Origin')).sendKeys(originZip);
    await driver.findElement(By.id('Destination')).sendKeys(destinationZip);

    // Select "Calculate price based on Shape and Size"
    await driver.findElement(By.id('option_4')).click();
    
    // Enter the weight
    await driver.findElement(By.id('Pounds')).sendKeys(weight);
    await driver.findElement(By.id('Ounces')).sendKeys('0');
    await driver.findElement(By.id('option_4')).click();


    for (const boxSize of boxSizes) {
      //clear inputs
      await driver.findElement(By.id('Length')).clear();
      await driver.findElement(By.id('Width')).clear();
      await driver.findElement(By.id('Height')).clear();
      // Enter the box dimensions and weight
 
      await driver.findElement(By.id('Length')).sendKeys(boxSize.length);
      await driver.findElement(By.id('Width')).sendKeys(boxSize.width);
      await driver.findElement(By.id('Height')).sendKeys(boxSize.height);


      // Click the "Continue" button by value
      await driver.findElement(By.css('input[value="Continue"]')).click();

      // Find an h4 element by text "USPS Retail Ground" and find the first sibling with td class price with a css selector and get the text

      await driver.wait(until.elementLocated(By.css('.price')), 5000);

      const prices = await driver.findElements(By.css('.price'));

      let price = await prices[4].getText();


      price = price.split('$')[1]

      price = parseInt(price);

      const screenshot = await driver.takeScreenshot();
      fs.mkdirSync('./screenshots', { recursive: true });
      fs.writeFileSync(`./screenshots/${boxSize.name}.png`, screenshot, 'base64');
      


      console.log(`${boxSize.name} box - Shipping cost: ${price}`);
      console.assert(price < 80, "price is higher than $80")
    
      await driver.navigate().back();
    }

  }
  catch (error) {
    console.error(error);

  } finally {
    // Quit the driver
    await driver.quit();
  }
}
