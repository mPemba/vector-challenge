module.exports = {
  async generateHtmlReport(results, browserName, options) {
    let htmlReport = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>USPS Calculator Test Results</title>
        <style>
          body {
            font-family: Helvetica, Arial, sans-serif;
            padding: 40px 80px;
          }
          h1 {
            color: #2E4057;

          }
          h2 {
            color: #2E4057;
          }
          table {
            border-collapse: collapse;
            border: none;
            max-width: 600px;
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
        <h1>Test Results</h1>
        <tr>
        <p><b>Browser:</b> ${browserName}</p>
        <p><b>Origin ZIP:</b> ${options.originZip}</p>
        <p><b>Destination ZIP:</b> ${options.destinationZip}</p>
        <p><b>Weight:</b> ${options.weight} lbs</p>
        <h2>Box Sizes:</h2>
        <ul>
          ${options.boxSizes.map((box) => {
            return `<li><b>${box.name}</b>: ${box.length} x ${box.width} x ${box.height}</li>`;
          }).join("")}
        </ul>
        <br />
        <table border="1" style="width:100%">
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