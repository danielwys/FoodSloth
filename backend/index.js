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

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

