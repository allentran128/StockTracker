const app = require('../../app');

/* Fetches the stocks with matching prefix of the query
 *
 * Returns a list of stocks
 */
module.exports = (req, res, next) => {
  // Make a call to the Trie-Seach to search for
  // the query as req.query.q
  //
  // Return a JSON of all the suggested items
  // as an Array
  const query = req.query.q;
  const suggestions = app.ts.get(query);
  const result = [];

  // parse suggestions to be only symbol key
  for (var i = 0; i < suggestions.length; i++) {
    result.push(suggestions[i].symbol);
  }

  res.set("Content-Type", "text/plain");
  res.send(result);
};
