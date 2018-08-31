"use strict";

const express = require("express");
const morgan = require("morgan");

const app = express();

const addr = process.env.ADDR || ":80";

const [host, port] = addr.split(":");


var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "alltran",
  password: "GrandDao1!"
});



// add JSON request body parsing middleware
app.use(express.json());
// add the request logging middleware
app.use(morgan("dev"));

// Register
app.post("/register", (req, res, next) => {
    res.set("Content-Type", "text/plain");

    res.json(req.body);
    /*
    con.connect(function(err) {
        console.log("Connected!");
        // TODO get other params as well
        const user=req.body.var1;
        const pass=req.body.var2;   console.log("Connected!");
        const sql = `SELECT * FROM userinfo WHERE username = '${user}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Result: " + result);
            res.send("Validating...");
            // TODO if not exist in DB, then register
        });

        if (err) throw err;
    });
    */
});

// Log in
app.get("/login", (req, res, next) => {
    res.set("Content-Type", "text/plain");

    res.json(req.body);

    /*
    con.connect(function(err) {
        console.log("Connected!");
        const user=req.body.var1;
        const pass=req.body.var2;   console.log("Connected!");
        const sql = `SELECT * FROM userinfo WHERE username = '${user}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Result: " + result);
            res.send("Validating...");
            // TODO if exists in DB, then verify password
        });

        if (err) throw err;
    });
    */
});

// Get Stock
app.get("/stock/:name", (req, res, next) => {
    res.set("Content-Type", "text/plain");
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
    res.send("Fetching...");
});



//start the server listening on host:port
app.listen(port, host, () => {
    //callback is executed once server is listening
    console.log(`server is listening at http://${addr}...`);
});
