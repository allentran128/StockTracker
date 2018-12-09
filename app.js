"use strict";
// Dependencies
const app = require('express')();
const routes = require('./routes');

// original dependencies
const https = require("https");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const TrieSearch = require("trie-search");
// const session = require('express-session');

const addr = process.env.ADDR || ":80";
const [host, port] = addr.split(":");

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

const mysql = require('mysql');
const con = mysql.createConnection({
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

// Export shared variables
exports.con = con;
exports.ts = ts;
exports.stocks = stocks;
exports.https = https;

// Add Routes
app.use('/', routes);

// Start Server
app.listen(port, host, () => {
  console.log('App listening on port 4000');
});
