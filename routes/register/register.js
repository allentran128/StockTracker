'use strict';

const app = require('../../app');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* Registers a email/pass if not in database
 *
 * On success, notify JS that it is okay to proceed (JS will redirect to user.html)
 * On fail, notify user that email is taken
 */
module.exports = (req, res, next) => {
    console.log("Registering...");
    console.log(req.body);

    if (typeof req.body.username !== 'undefined' && req.body.username) {
        const user = req.body.username;
        const pass = req.body.password;
        const table = 'basic_user_info';
        const sql = `SELECT * FROM ${table} WHERE email = '${user}'`;

        app.con.query(sql, function (err, result) {
            if (err) throw err;

            console.log(result);
            if (result == 'undefined' || result.length == 0) {
                // Good, we can register

                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(pass, salt, function(err, hash) {
                        const sql2 = `INSERT INTO ${table} VALUES (NULL, '${user}', '${hash}')`;
                        console.log(sql2);
                        app.con.query(sql2, function(err, result) {
                            if (err) throw err;

                            console.log(result);
                            console.log(`Just added '${user}':'${hash}' to ${table}`);
                            res.status(200).send("Register Success");
                        });
                    });
                });

            } else {
                // Bad, username already in use
                res.status(401).send("Username / Email taken.");
            }
        });

    } else {
        res.status(401).send("Invalid information, please try again.");
    }
};
