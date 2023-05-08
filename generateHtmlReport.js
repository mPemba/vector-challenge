module.exports = {
  async generateHtmlReport(results, browserName, options) {
    let htmlReport = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>USPS Retail Postage Calculator</title>
        <style>
          body {
            font-family: Helvetica, Arial, sans-serif;
            padding: 40px 80px;
          }
          h1 {
            color: #1e1f1e;
            font-size: 24px;
          }
          h2 {
            color: #1e1f1e;
            font-size: 18px;
          }
          ul {
            list-style-type: decimal;
            padding-inline-start: 18px;
          }
          p {
            color: #1e1f1e;
            font-size: 14px;
          }
          table {
            width: 80%;
            border-collapse: collapse;
            border: none;
            max-width: 600px;
            font-size: 14px;
          }
          th {
            background-color: #2E4057;
            color: white;
          }
          th, td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {background-color: #f2f2f2;}
        </style>
      </head>
      <body>
        <h1>USPS Retail Postage Calculator Test Results</h1>
        <p>
          <b>Date:</b> ${new Date().toLocaleString()}
        </p>
        <p>
          <b>Browser:</b> ${browserName.charAt(0).toUpperCase() + browserName.slice(1)}
        </p>
        <p>
          <b>Origin ZIP:</b> ${options.originZip}
        </p>
        <p>
          <b>Destination ZIP:</b> ${options.destinationZip}
        </p>
        <p>
          <b>Weight:</b> ${options.weight} lbs
        </p>
        <h2>Box Sizes:</h2>
        <ul>
          ${options.boxSizes.map((box) => {
            return `<li>
                      <p>
                        <b>${box.name}</b>: ${box.length} x ${box.width} x ${box.height}
                      </p>
                    </li>`;
          }).join("")}
        </ul>
        <br />
        <table>
          <tr>
            <th>Box Size</th>
            <th>Shipping Price</th>
            <th>Result</th>
          </tr>
          ${results.map((result) => {
            return `
              <tr>
                <td>${result.boxSize}</td>
                <td>$${result.shippingPrice}</td>
                <td>${result.result}</td>
              </tr>
            `}).join("")}
        </table>
      </body>
    </html>
    `;

    return htmlReport;
  },
};