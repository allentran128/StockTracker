"use strict";

const https = require("https");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const TrieSearch = require("trie-search");
const session = require('express-session');

const app = express();
app.use(session({
  secret: 'access from environment',
  resave: false,
  saveUninitialized: true
}));

// Setup Search Bar
const ts = new TrieSearch("symbol"); // by symbol
const stocks = {}; // Hashmap for validity of stock
loadStocks(ts);

function loadStocks(ts) {
  // get a list of symbols from : https://api.iextrading.com/1.0/ref-data/symbols
  // then modify that json to only have the symbols, then use trie-search's addFromObject or so to make a trie
  https.get("https://api.iextrading.com/1.0/ref-data/symbols", (resp) => {
    let data = '';

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      const parsedData = JSON.parse(data);
      ts.addAll(parsedData);

      for (const i in parsedData) {
        stocks[(parsedData[i]["symbol"])] = true;
      }
    });

  }).on("error", (err) => {
    console.log(err);
  });
};

const addr = process.env.ADDR || ":80";

const [host, port] = addr.split(":");

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "alltran",
  password: "GrandDao1!", // TODO use environment var to look up password!
  database: "User"
});

// Allow all CORS requests
app.use(cors()); // TODO remove later during production

// add JSON request body parsing middleware
app.use(express.json());

// add the request logging middleware
app.use(morgan("dev"));

// Initial connect for 'User' database
con.connect();

/* Registers a email/pass if not in database
 *
 * On success, notify JS that it is okay to proceed (JS will redirect to user.html)
 * On fail, notify user that email is taken
 */
app.post("/register", (req, res, next) => {
    console.log("Registering...");
    console.log(req.body);

    if (typeof req.body.username !== 'undefined' && req.body.username) {

      const user = req.body.username;
      const pass = req.body.password;
      const table = 'basic_user_info';
      const sql = `SELECT * FROM ${table} WHERE email = '${user}'`;
      con.query(sql, function (err, result) {
        if (err) throw err;

        console.log(result);
        if (result == 'undefined' || result.length == 0) {
          // res.send("Registering...");
          // Good, we can register

          const sql2 = `INSERT INTO ${table} VALUES (NULL, '${user}', '${pass}')`;
          console.log(sql2);
          con.query(sql2, function(err, result) {
            if (err) throw err;

            console.log(result);

            console.log(`Just added '${user}':'${pass}' to ${table}`);

            res.send("Register Success");

          });
        } else {
          // Bad, username already in use
          res.send("Username / Email taken.");
        }
      });
    } else {
      res.send("Error, please try again.");
    }
});

/* Validates email/pass against database
 *
 * TODO: should redirect on success/fail
 *  notify JS on success to "windows.location.replace = 'url'"
 *
 *  else produce a login failed message
 */
app.post("/login", (req, res, next) => {
    //res.set("Content-Type", "text/plain");

    //res.json(req.body);
    //res.send('Welcome!');
    console.log(req.body);

    if (typeof req.body.username !== 'undefined' && req.body.username) {

      const user = req.body.username;
      const table = 'basic_user_info';
      const sql = `SELECT * FROM ${table} WHERE email = '${user}'`;
      console.log("Query: " + sql);

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: ");
        console.log(result[0]);

        if (result[0].password == req.body.password) {
          console.log("Matching passwords");

          if (!req.session.loginCount) {
            req.session.loginCount = 0;
          }
          req.session.loginCount += 1;

          // ACTIVATE SESSION
          console.log("Login Success! " + user + ", login count is " + req.session.loginCount);

          res.send("Login Success! " + "Welcome " + user + ", uid: " + req.session.id);
        } else {
          console.log("Attempt: " + req.body.password + " vs " + result[0].password);
          res.send("Login Failed. Wrong Password!");
        }
      });
    } else {
      // ERROR
      res.send("Error, no username detected.");
    }
});

/* Validates if the query is a valid stock name
 *
 * Returns "Valid" if valid, else "Invalid"
 */
app.get("/verify", (req, res, next) => {
  const stock = req.query.name;
  res.set("Content-Type", "text/plain");
  if (stocks[stock] != undefined && stocks[stock]) {
    res.send("Valid");
  } else {
    res.send("Invalid");
  }
});

/* Fetches the stocks with matching prefix of the query
 *
 * Returns a list of stocks
 */
app.get("/stock", (req, res, next) => {
  // Make a call to the Trie-Seach to search for
  // the query as req.query.q
  //
  // Return a JSON of all the suggested items
  // as an Array
  const query = req.query.q;
  const suggestions = ts.get(query);
  const result = [];

  // parse suggestions to be only symbol key
  for (var i = 0; i < suggestions.length; i++) {
    result.push(suggestions[i].symbol);
  }

  res.set("Content-Type", "text/plain");
  res.send(result);
});

/* Given a valid stock name, fetch data from API of the
 * company info
 *
 * basic info
 *
 */
app.get("/stock/info/:name", (req, res, next) => {
    const stock = req.params.name;
    https.get(`https://api.iextrading.com/1.0/stock/${stock}/company`, (resp) => {
      let data = '';

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        res.json(data);
      });

    }).on("error", (err) => {
      console.log(err);
      res.send("Error, try again");
    });
});


/* Given a valid stock name, fetch data from the API
 * For now, returns the current (closing) price of stock
 */
app.get("/stock/:name", (req, res, next) => {
    const stock = req.params.name;
    https.get(`https://api.iextrading.com/1.0/stock/${stock}/price`, (resp) => {
      let data = '';

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        res.send(data);
      });

    }).on("error", (err) => {
      console.log(err);
      res.send("Error, try again");
    });
});

// start the server listening on host:port
app.listen(port, host, () => {
    console.log(`server is listening at http://${addr}...`);
});
