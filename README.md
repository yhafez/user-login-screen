 # Simple Developer Exercise

The savvy cats over at SMART Pump would like to be able to allow users to login to their account, check their balance and update their personal details. Write a simple web application (API and UI) using node.js and lowdb that lets users accomplish those tasks.

Feel free to use any other libraries or tool chains as long as the core code is javascript and node.js. npm (https://www.npmjs.org) is your friend - no need to recreate the wheel.

You will find the base data file in `/data`

Wireframes: `assets/wireframes.png`

## Time limits

This exercise is meant showcase your creativity and talent in problem solving against a real world scenario. To that end it should not consume your every waking moment. We recommend at max spending 3 evenings of time on the exercise.

## Database Structure

Below is an example of user login inside the database.

```
{
  "_id": "5410953eb0e0c0ae25608277",
  "guid": "eab0324c-75ef-49a1-9c49-be2d68f50b96",
  "isActive": true,
  "balance": "$3,585.69",
  "picture": "http://placehold.it/32x32",
  "age": 30,
  "eyeColor": "blue",
  "name": {
	"first": "Henderson",
	"last": "Briggs"
  },
  "company": "GEEKNET",
  "email": "henderson.briggs@geeknet.net",
  "salt": "23derd*334", // Bonus for salt password hashing
  "password": "9e4d16b6e67aa3a9b2fbb6a488bf32fb53bc34a7", // Bonus for salt password hashing
  "phone": "+1 (936) 451-3590",
  "address": "121 National Drive, Cotopaxi, Michigan, 8240"
}
```

## Requirements

~~\* Create a sign up page to allow user to register new login~~
~~\* Login to the app via email and password~~

~~- Restrict access to valid a User~~
~~- Once logged in show the details of the user on the page~~
~~- Authorized users can check their account balance~~
~~- Allow the user to change their details~~
~~\* lowdb (DB) -> https://github.com/typicode/lowdb~~
~~\* node.js -> http://nodejs.org/ ~~

## Bonus Points

~~- Implememnt password hashing (eg. append a salt onto the password before hash with SHA1)~~
~~\* Fully responsive UI~~

~~- Unit Tests of the API~~
~~- Functional Tests of the UI~~
