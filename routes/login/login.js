'use strict';

const app = require('../../app');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* Validates email/pass against database
 *
 * TODO: should redirect on success/fail
 *  notify JS on success to "windows.location.replace = 'url'"
 *
 *  else produce a login failed message
 */
module.exports =  (req, res, next) => {
    console.log(req.body);

    if (typeof req.body.username !== 'undefined' && req.body.username) {
        const user = req.body.username;
        const table = 'basic_user_info';
        const sql = `SELECT * FROM ${table} WHERE email = '${user}'`;
        console.log("Query: " + sql);

        app.con.query(sql, function (err, result) {
            if (err) throw err;

            console.log("Result: ");
            console.log(result);
            console.log(result[0]);
            if (result == 'undefined' || result.length == 0) {
                // Bad, no known acc
                res.status(401).send("Not a valid account!");
            } else {
                bcrypt.compare(req.body.password, result[0].password, (error, val) => {
                    if (error) throw error;

                    if (val) {
                        console.log("Matching passwords");
                        res.status(200).send("Login Success!");
                    } else {
                        console.log("Attempt: " + req.body.password + " vs " + result[0].password);
                        res.status(401).send("Login Failed!");
                    }
                });
            }
        });
    } else {
        res.send("Error, no username detected.");
    }
};
