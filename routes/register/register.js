'use strict';

const app = require('../../app');
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

          const sql2 = `INSERT INTO ${table} VALUES (NULL, '${user}', '${pass}')`;
          console.log(sql2);
          app.con.query(sql2, function(err, result) {
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
};
