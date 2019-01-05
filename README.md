# Personal Stock Tracker

## Description
Web application that provides real-time stock information (price, news, price history) from [IEX](https://iextrading.com/developer/docs/). User's can input stock transactions and see charts of gains/losses over time.

## Testing Development Web Server Locally
To host the webpages:
Run the following command to test locally on port 8000.

```
cd urls
python -m SimpleHTTPServer
```

To host the server:
Run the following command in a different terminal.

```
export ADDR=localhost:4000
node app.js
```

## How it works.
- Front End: Angular.js
- Back End: Node.js
- Database: mySQL
- Hosting: AWS Docker
- Passwords are encrpyted with SHA256 and passwords in database are hashed.
