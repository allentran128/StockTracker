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
    document.getElementById("btn").onclick = function() {
      console.log("Clicked Submit Button.");

      const req = new XMLHttpRequest();

      req.open("GET", "/login");
      req.onload = function() {
        const rep = JSON.parse(req.responseText);
        console.log(rep);
      }

      req.send();
  }

})();
