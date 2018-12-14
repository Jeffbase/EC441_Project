# EC441_Project
 Attandence Clicker

Group Member: Yuhang He & Junwei Zhou


## Summary

In this project, we make a attandence clicker and an web app which could show the attandence sheet. Since we use dynamic dns, so everyone can check this attandence sheet online. 

## Design Solution

-For clicker, we choose esp board, because this microcontroller can connect to WIFI and price is cheep. we make a botton for user to click. When botton is clicked, esp board will get a signal and send UDP message to Node.js server. 

-In Node.js file, we create a htttp server. It will decode message from esp board and compare to database. If the message(id, code pair) is in database, it will move this student name to attend list. It will keep doing this when the stop botton is pressed. Also, we can reset the whole list whenever we want if we press reset botton on html. 

-html connect with node.js by io socket. 


