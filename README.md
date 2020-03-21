# cs2102

## Installation guide
### Frontend
1. `git clone https://github.com/dawo5010/cs2102.git` to clone the repo
2. `npm install` to install relevant node modules
3. `npm install nodemon` to install nodemon
4. Execute by running `npm run dev`
5. Website is available on localhost:8000
  <br/> note: the website is not available unless `npm run dev` is executing

### Backend
1. Navigate to the backend folder
2. `npm install` to install the relevant node modules
3. Start server with `node index.js`
4. Backend is available at localhost:8001
  
## Setting up temporary database using postgresql for given queries.js file
1. psql postgres
2. CREATE ROLE me WITH LOGIN PASSWORD 'password';
3. ALTER ROLE me CREATEDB; 
4. psql -d postgres -U me
5. CREATE DATABASE api;
6. \c api
1. CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);
1. INSERT INTO users (name, email)
  VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com'); (add random entries)
1. `npm i express pg` to install Express for the server and node-postgres (pg) to be able to connect to PostgreSQL
1. run `node backend/index.js`, list of all users in json format available on http://localhost:8001/users
