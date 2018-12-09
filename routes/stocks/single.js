const app = require('../../app');

/* Given a valid stock name, fetch data from the API
 * For now, returns the current (closing) price of stock
 */
module.exports = (req, res, next) => {
    const stock = req.params.name;
    app.https.get(`https://api.iextrading.com/1.0/stock/${stock}/price`, (resp) => {
      let data = '';

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        res.send(data);
      });

    }).on("error", (err) => {
      console.log(err);
      res.send(`Corrupted fetch of stock price for ${stock}, try again.`);
    });
};
