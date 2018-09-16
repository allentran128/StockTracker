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
    window.suggestXHR = new XMLHttpRequest();
    window.verifyXHR = new XMLHttpRequest();
    window.fetchXHR = new XMLHttpRequest();
    window.resBox = document.getElementById("price");

    var name = document.getElementById("name_input");
    name.addEventListener("keyup", (event) => {suggest(event)});

    var btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
      const stock = document.getElementById("name_input").value;
      verifyStock(stock);
    });
  };

  /* Fetches the stock info and displays it
   * into results div
   *
   * TODO: check if there are missing values
   *  ie CEO
   *  and dont display them
   */
  function fetchStockInfo(stock) {
    console.log("Fetching..." + stock);

    window.fetchXHR.abort();
    window.fetchXHR.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log("Response from fetch: " + response);
        response = JSON.parse(response);
        document.getElementById("stock_name").innerHTML = response["symbol"];
        document.getElementById("industry").innerHTML = "Industry: " + response["industry"];
        document.getElementById("ceo").innerHTML = "CEO: " + response["CEO"];
        document.getElementById("url").setAttribute("href", response["website"]);
        document.getElementById("url").innerHTML = response["website"];
        document.getElementById("desc").innerHTML = response["description"];

        console.log("finished loading info");
        fetchStockPrice(stock);
      }
    };

    window.fetchXHR.open("GET", "http://localhost:4000/stock/info/" + stock, true);
    window.fetchXHR.send();

  }


  /* Given a string {stock}
   * verify if that string is a valid
   * stock symbol
   */
  function verifyStock(stock) {
    console.log("Verifying..." + stock);

    window.verifyXHR.abort();
    window.verifyXHR.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        console.log("Response from Verify: " + response);
        if(response == "Valid") {
          fetchStockInfo(stock);
        }
      }
    };

    window.verifyXHR.open("GET", "http://localhost:4000/verify?name=" + stock, true);
    window.verifyXHR.send();
  }

  /* Given a valid stock name
   * fetch the current price of the stock
   * and display it in the results section
   */
  function fetchStockPrice(stock) {
    window.fetchXHR.abort();
    window.fetchXHR.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        console.log("Price of " + stock + " is " + response);
        window.resBox.innerHTML = "$" + response;
      }
    };

    window.fetchXHR.open("GET", "http://localhost:4000/stock/" + stock, true);
    window.fetchXHR.send();
  }

  /* Given a query from search box, returns a list
   * of stock symbols whom's suffix matches the query
   */
  function suggest(event) {
    var input = event.target;
    var huge_list = document.getElementById("huge_list");
    var min_characters = 0;

    if (input.value.length < min_characters ) {
      return;
    } else {
      console.log(input);
      window.suggestXHR.abort();

      window.suggestXHR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var response = JSON.parse(this.responseText);
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
