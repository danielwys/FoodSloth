# cs2102

## Installation guide
1. `git clone https://github.com/dawo5010/cs2102.git` to clone the repo
1. `npm install` to install relevant node modules
1. `npm install nodemon` to install necessary nodemon modules
1. execute by running `npm run dev`
1. website is available on "http://localhost:8000/"
  <br/> note: the website is not available unless `npm run dev` is executing
  
## Setting up temporary database using postgresql for given queries.js file
1. psql postgres
1. CREATE ROLE me WITH LOGIN PASSWORD 'password';
1. ALTER ROLE me CREATEDB; 
1. psql -d postgres -U me
1. CREATE DATABASE api;
1. \c api
1. CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);
1. INSERT INTO users (name, email)
  VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com'); (add random entries)
1. `npm i express pg` to install Express for the server and node-postgres (pg) to be able to connect to PostgreSQL
1. run `node backend/index.js`, list of all users in json format available on http://localhost:8000/users
