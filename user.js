/* SEARCH, RESULTS, MENU FUNCTIONALITY
 *
 * Search: send queries to server periodically to retireve suggestions
 *
 * Results: send <stock> query to server,
 *  retrieve data at client,
 *  graph data on html (via JS)
 *
 * Menu:
 *  Transactions: reuse the [Results] div to display a table of prev
 *    or use a new html page... (more work)
 *  Inventory: reuse the [Results] div to display owned stocks
 *  Log out: redirect to the home page (end session)
 *
 * TODO: Implement Sessions
 * TODO: Figure out forms, to get search query
 *        for now, use btn click to envoke javascript
 */


(function() {
  'use strict';

  window.onload = function() {
    var name = document.getElementById("name_input");
    name.addEventListener("keyup", function(event) {suggest(event)});

    var btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
      // Verify the stock name (not null, etc)
      console.log("Verifying..." + name.value);
    });

    window.suggestXHR = new XMLHttpRequest();
  };


  function suggest(event) {
    var input = event.target;
    var huge_list = document.getElementById("huge_list");
    var min_characters = 0;

    if (input.value.length < min_characters ) {
      return;
    } else {
      console.log(input);
      // abort any pending requests
      window.suggestXHR.abort();

      window.suggestXHR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var response = JSON.parse( this.responseText );
          huge_list.innerHTML = "";
          response.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item;
            huge_list.appendChild(option);
          });
        }
      };

      window.suggestXHR.open("GET", "http://localhost:4000/stock/?q=" + input.value, true);
      window.suggestXHR.send();
    }
  }
})();
