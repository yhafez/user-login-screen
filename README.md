# Instructions for running the application

Begin by cloning and navigating into the repository

```
git clone https://github.com/yhafez/user-login-screen.git

cd user-login-screen
```

Open the repository in your code editor of choice and create an `.env` file at the root of the project. Copy and paste the contents of `.env.sample` into it.

Open up a terminal and navigate to the repository. You'll need to install the package dependencies for the application. You can use NPM, Yarn, or PNPM, but for best results, use PNPM (Note:If using NPM, you must pass the --legacy-peer-deps flag for the packages to install properly). I will be using PNPM for the rest of the instructions, but any package manager using the equivalent commands should work.

```
npm install --legacy-peer-deps

# or

yarn

# or

pnpm install
```

Once the packages are successfully installed, we can begin the process of launching the application. Using your package manager of choice, you can choose to run the client and server in separate terminals by running the `client:dev` and `server:dev` in each terminal, or you can launch both at once using the `start:dev` command.

```
pnpm start:dev
```

By default, the application is configured to run the client on port 3000 and the server on port 5001, so if you have any issues during this step, particularly an `EADDRINUSE: address already in use :::5001` error, one or both of these servers may already be in use. You can check using the `lsof -i:3000` and `lsof -i:5001` commands in a terminal. If no processes are returned in the output, the ports are open, however if a process does appear, that means the port is in use. If the port is in use, the above command will also specift the PID of the process running on the port, which you can then use to kill that process using `kill [PID]` (without square brackets). Double-check that this is successful using the `lsof -i:[PORT]` command, as your machine may be configured to restart certain processes if they are killed.

Once the application is up-and-running, you can navigate to http://localhost:3000/ to interact with the client.

We can also run the application using the production scripts -- `start:prod`, `client:prod`, and `server:prod` -- in the same way as their `dev` counterparts. For the client to work properly using the productions scripts, you must first specify the `PORT` environment variable in your shell environment.

```
export PORT=3000

pnpm start:prod
```

## Testing the application

To run the tests for the client-side of the application, run the `test:client` script with your package manager.

```
pnpm test:client
```

To run the tests for the server-side of the application, we must first start the server using the same command that a production deployment of the application would use. This is because the `dev` script uses nodemon, which will occasionally reset the server in-between HTTP requests which causes subsequent tests to fail, whereas node will not do this.

```
pnpm server:prod

#or

pnpm start:prod
```

Then we can run the `test:server` script.

```
pnpm test:server
```

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
"\_id": "5410953eb0e0c0ae25608277",
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
"salt": "23derd\*334", // Bonus for salt password hashing
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

```

```

```

```

```

```
