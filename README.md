# Current Progress

## TODO
1. Update passwords storage to SHA256 using bcrypt [DONE]
2. Redirect pages (login -> dashboard, register -> login, dashboard -> logout, etc)
3. Host dev server for testing
4. Implement Session (express-session or JWT)
5. Handle invalid login / register cases (invalid email / password combo, invalid DB lookup, email already in use, etc)
6. Use mySQL session store
7. Implement Menu buttons (dashboard html & js)
8. Implement storing user data in the session store (user stock & transactions)
9. Make a display for user data (new html page)
10. Store / Access passwords / API keys from environment variable
11. Clean up code
12. Deploy on Docker / AWS

## Description
This web application fetches current stock information (price, news, price history).

## Upcoming Features
Add user accounts which will keep track of user's stocks and transactions. Then generate charts on user's net gain / loss.
