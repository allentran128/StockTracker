/* REGISTER FUNCTIONALITY
 *
 * TODO: Figure out how to Submit a form
 *
 *
 *
 */

(function() {
  'use strict';

  window.onload = function() {

    $("#prospects_form").submit(function(e) {
      e.preventDefault();
    });

    document.getElementById("btn").onclick = function() {
      console.log("Clicked Register Button.");

      const promise = new Promise(function(resolve, reject) {
        const res = login();
        if (res == 1) {
          // success
          console.log("Registered");
          resolve("done");
        } else {
          // failed
          console.log("Failed to register");
          reject(new Error("failed"));
        }
      });
    };

    function login() {
      const req = new XMLHttpRequest();

      req.open("POST", "http://localhost:4000/register");

      req.onreadystatechange = function() {
        const rep = req.responseText;
        console.log("I got a reply:");
        console.log(rep);
      };

      const user = document.getElementById("inputEmail").value;
      const pass = document.getElementById("inputPassword1").value;
      const pass2 = document.getElementById("inputPassword2").value;
      if (pass != pass2) {
        // Error
        // NOTE: No Ajax sent
        req.setRequestHeader("Content-Type", "text/plain");
        console.log("Password does not match");
        return 0;
      } else {
        const obj = {username: user, password: pass};
        req.setRequestHeader("Content-Type", "application/json");
        console.log(obj);
        console.log("Register User: " + user + ", Pass: " + pass);
        req.send(JSON.stringify(obj));
        return 1;
      }
    };
  };
})();
