const app = require('../../app');

/* Given a valid stock name, fetch data from API of the
 * company info
 */
module.exports = (req, res, next) => {
    const stock = req.params.name;
    app.https.get(`https://api.iextrading.com/1.0/stock/${stock}/company`, (resp) => {
      let data = '';

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        res.json(data);
      });

    }).on("error", (err) => {
      console.log(err);
      res.send(`Corrupted fetch of info on ${stock}, try again.`);
    });
};
