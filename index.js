"use strict";

const https = require("https");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const TrieSearch = require("trie-search");


const app = express();
const ts = new TrieSearch("symbol"); // by symbol
setupTrie(ts);

function setupTrie(ts) {
  // get a list of symbols from : https://api.iextrading.com/1.0/ref-data/symbols
  // then modify that json to only have the symbols, then use trie-search's addFromObject or so to make a trie
  https.get("https://api.iextrading.com/1.0/ref-data/symbols", (resp) => {
    let data = '';

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      ts.addAll(JSON.parse(data));
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
  password: "GrandDao1!",
  database: "User"
});

// Allow all CORS requests
app.use(cors());

// add JSON request body parsing middleware
app.use(express.json());

// add the request logging middleware
app.use(morgan("dev"));

// Initial connect
con.connect();

// Register
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
          // TODO, redirect to a new user.html page
        } else {
          // Bad, username already in use
          res.send("Username / Email taken.");
        }
      });
    } else {
      res.send("Error, please try again.");
    }
});

// Log in
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
          res.send("Login Success!");
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

app.get("/search", (req, res, next) => {
  const stock = req.query.name;
  console.log("FORM: stock = " + stock);

  res.set("Content-Type", "text/plain");
  res.send(stock);
});

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

// Get Stock
app.get("/stock/:name", (req, res, next) => {
    //res.set("Content-Type", "text/plain");
    // req.params.name
    /*
    con.connect(function(err) {
      console.log("Connected!");
      const sql = 'SELECT * FROM ${name}'; // maybe limit to top 50 res?
      con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Result: " + result);
        res.send(result);
      });

      if (err) throw err;
    */

    const stock = req.params.name;
    // verify that stock is valid
    console.log(ts.get(stock));
    if (ts.get(stock).length == 1) {
      //res.send("valid...fetching... " + stock);
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
      });
    // https://api.iextrading.com/1.0/stock/${stock}/price
    } else {
      res.send("invalid fetching... " + stock);
    }
});

//start the server listening on host:port
app.listen(port, host, () => {
    //callback is executed once server is listening
    console.log(`server is listening at http://${addr}...`);
});
