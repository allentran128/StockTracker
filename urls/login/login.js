/* LOG IN FUNCTINALITY
 *
 * TODO: have user send back a user.html page and have JS redirect there
 *
 */

(function() {
  'use strict';

  window.onload = function() {
    /* upon submit button click, we want to
     * send an ajax call to the server
     * with user and password in a JSON obj
     *
     * Then we test if the server has gotten the
     * request
     *
     * But we must figure out how to host both
     * the site and the server on localhost.
     *
     */

    $("#prospects_form").submit(function(e) {
      e.preventDefault();
    });

    document.getElementById("btn").onclick = function() {
      console.log("Clicked Submit Button.");

      const req = new XMLHttpRequest();

      req.open("POST", "http://localhost:4000/login");
      //req.setRequestHeader("Access-Control-Allow-Origin", "http://localhost");

      req.onreadystatechange = function() {
        const rep = req.responseText;
        console.log("I got a reply:");
        console.log(rep);
        document.location.href = '../dashboard/user.html';
      };

      req.setRequestHeader("Content-Type", "application/json");
      const user = document.getElementById("inputEmail").value;
      const pass = document.getElementById("inputPassword").value;
      const obj = {username: user, password: pass};
      console.log(obj);
      console.log("User: " + user + ", Pass: " + pass);
      req.send(JSON.stringify(obj));
    };
  };
})();
