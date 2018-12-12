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
 * TODO: Figure out whether to chain events or load in parallel
 *        right now, its very ugly style
 *        find "NEXT"
 */


(function() {
  'use strict';

  window.onload = function() {
    window.suggestXHR = new XMLHttpRequest();
    window.verifyXHR = new XMLHttpRequest();
    window.fetchPriceXHR = new XMLHttpRequest();
    window.fetchInfoXHR = new XMLHttpRequest();
    window.fetchNewsXHR = new XMLHttpRequest();
    window.resBox = document.getElementById("price");

    var name = document.getElementById("name_input");
    name.addEventListener("keyup", (event) => {suggest(event)});

    var btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
      const stock = document.getElementById("name_input").value;
      verifyStock(stock);
    });
  };

  function fetchStockNews(stock) {
    console.log("Fetching news");

    // Clear
    document.getElementById("news").innerHTML = "";

    var header = document.createElement('h2');
    header.innerHTML = "Most Recent News";
    document.getElementById("news").appendChild(header);

    window.fetchNewsXHR.abort();
    window.fetchNewsXHR.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        for (var i in response) {
          var article = response[i];
          var title = article["headline"] + `(${article["source"]})`;
          var link = document.createElement('a');
          link.setAttribute("href", article["url"]);
          link.innerHTML = title;
          document.getElementById("news").appendChild(link);
          console.log(i + ":" + title);

          var br = document.createElement('br');
          document.getElementById("news").appendChild(br);
        }
      }
    };

    window.fetchNewsXHR.open("GET",`https://api.iextrading.com/1.0/stock/${stock}/news/`);
    window.fetchNewsXHR.send();
  }

  /* Data is JSON obj
   */
  function parseChartData(data) {
    console.log("Parsing Chart Data");
    console.log(data);

    var labels = [];
    var prices = [];

    for (var i in data) {
      const point = data[i];
      labels[i] = point["label"];
      prices[i] = point["close"];
    }

    console.log("labels: " + labels);
    console.log("prices: " + prices);

    // NEXT
    graphChartData({"labels":labels, "prices":prices});
  }

  /* Data will be a JSON obj with labels arr and data arr
   */
  function graphChartData(data) {
    console.log("Graphing the data");
    console.log(data);

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: data["labels"],
            datasets: [{
                label: "Historical Prices Within Last Month",
                borderColor: 'rgb(255, 99, 132)',
                data: data["prices"]
            }]
        },

        options: {}
    });
  }

  /* Makes a request to fetch historical stock prices
   * then graphs it
   */
  function loadChart(stock) {
    console.log("loading chart");

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        // NEXT
        parseChartData(response);
      }
    };

    xhr.open("GET",`https://api.iextrading.com/1.0/stock/${stock}/chart/1m/`);
    xhr.send();
  }


  /* Fetches the stock info and displays it
   * into results div
   */
  function fetchStockInfo(stock) {
    console.log("Fetching..." + stock);

    window.fetchInfoXHR.abort();
    window.fetchInfoXHR.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log("Response from fetch: " + response);
        response = JSON.parse(response);
        document.getElementById("stock_name").innerHTML = response["symbol"];

        // Optional field
        if (response["industry"] != undefined && response["industry"]) {
          document.getElementById("industry").innerHTML = "Industry: " + response["industry"];
        } else {
          document.getElementById("industry").innerHTML = "";
        }

        // Optional field
        if (response["CEO"] != undefined && response["CEO"]) {
          document.getElementById("ceo").innerHTML = "CEO: " + response["CEO"];
        } else {
          document.getElementById("ceo").innerHTML = "";
        }

        document.getElementById("url").setAttribute("href", response["website"]);
        document.getElementById("url").innerHTML = response["website"];
        document.getElementById("desc").innerHTML = response["description"];

        console.log("finished loading info");
      }
    };

    window.fetchInfoXHR.open("GET", "http://localhost:4000/stock/info/" + stock, true);
    window.fetchInfoXHR.send();

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
          // NEXT
          fetchStockInfo(stock);
          fetchStockPrice(stock);
          loadChart(stock);
          fetchStockNews(stock);
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
    window.fetchPriceXHR.abort();
    window.fetchPriceXHR.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        console.log("Price of " + stock + " is " + response);
        window.resBox.innerHTML = "$" + response;
      }
    };

    window.fetchPriceXHR.open("GET", "http://localhost:4000/stock/" + stock, true);
    window.fetchPriceXHR.send();
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
