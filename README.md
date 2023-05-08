# Vector Challenge

This project contains automated test cases for the [USPS Postage Calculator](https://postcalc.usps.com/).

## Test Case

A client would like to ship 25 lbs of devices equipment from <b>Austin</b> (ZIP code 78727) to <b>San Francisco</b> (ZIP code 94107)

There are 3 types of Home Depot Moving boxes that can be used for shipping:<br>
<b>Small</b> - (16 in. L x 12 in. W x 12 in. D)<br>
<b>Medium</b> -  (22 in. L x 16 in. W x 15 in. D)<br>
<b>Large</b> - (28 in. L x 15 in. W x 16 in. D)

Using USPS Retail Postage Calculator, please “Calculate price based on Shape and Size” for the “USPS Retail Ground, Retail price” for each box type.

If the price is <i>higher</i> than $80 - the test should fail. If the price is <i>less</i> than $80 - the test passes.

## Prerequisites

Must have Chrome and FireFox installed 

Or if you don't want to install Firefox, comment out this Builder code in `index.js`:

```javascript
const { Options: FirefoxOptions } = require("selenium-webdriver/firefox");

const ffDriver = new Builder()
  .forBrowser("firefox")
  .setFirefoxOptions(new FirefoxOptions().setPageLoadStrategy("normal"))
  .build();

checkForPricesAndTest(ffDriver, priceOptions);
```

## How to Test

Clone and Navigate to the directory in your terminal:<br>
`git clone https://github.com/mPemba/vector-challenge.git`
`cd vector-challenge`

First run: `npm install`.

To invoke the script, run either `npm test` or `node index.js`.

## Expected Results

```diff
Running tests for chrome... 
Running tests for firefox... 

+ Pass  chrome - Small box - Shipping cost: 62.55
- Fail  chrome - Medium box - Shipping cost: 101.5
- Fail  chrome - Large box - Shipping cost: 119.75
+ Pass  firefox - Small box - Shipping cost: 62.55
- Fail  firefox - Medium box - Shipping cost: 101.5
- Fail  firefox - Large box - Shipping cost: 119.75
```

## Reports
Reports and screenshots are created and stored in `/test_results` where I am exporting an HTML and JSON report for each browser.

Copying the path of the .html file and navigating to that route in the browser will display the report. 
