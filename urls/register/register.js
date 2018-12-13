/* REGISTER FUNCTIONALITY
 *
 * TODO: Figure out how to Submit a form
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

      const req = new XMLHttpRequest();

      req.open("POST", "http://localhost:4000/register");

      req.onreadystatechange = function() {
        if (req.status == 200) {
          document.location.href = '../dashboard/user.html';
        } else {
          document.getElementById("welcomeMsg").innerHTML = "Email Taken. Try Again";
        }

      };

      const user = document.getElementById("inputEmail").value;
      const pass = document.getElementById("inputPassword1").value;
      const pass2 = document.getElementById("inputPassword2").value;

      if (pass != pass2) {
        // Error
        // NOTE: No Ajax sent
        req.setRequestHeader("Content-Type", "text/plain");
        document.getElementById("welcomeMsg").innerHTML = "Passwords do not match. Try again";
      } else {
        const obj = {username: user, password: pass};
        req.setRequestHeader("Content-Type", "application/json");
        console.log(obj);
        console.log("Register User: " + user + ", Pass: " + pass);
        req.send(JSON.stringify(obj));
      }
    }
  };
})();
