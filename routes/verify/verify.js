const app = require('../../app');

/* Validates if the query is a valid stock name
 *
 * Returns "Valid" if valid, else "Invalid"
 */
module.exports = (req, res, next) => {
  const stock = req.query.name;
  res.set("Content-Type", "text/plain");
  if (app.stocks[stock] != undefined && app.stocks[stock]) {
    res.send("Valid");
  } else {
    res.send("Invalid");
  }
};
