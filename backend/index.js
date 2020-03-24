// index.js

/**
 * Required External Modules
 */

const express = require("express");
const bodyParser = require('body-parser')

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8001";
const db = require('./queries')
/**
 *  App Configuration
 */

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
/**
 * Routes Definitions
 */

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getAllUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

