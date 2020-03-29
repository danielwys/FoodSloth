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
  
### Setting up localdatabase using postgresql for given queries.js file
1. navigate to backend folder
2. psql postgres
3. CREATE DATABASE project;
4. \c project
5. create tables using sql/tables.sql
6. insert values for each table according to labeled order in sql folder
7. change password and user values in queries.js according to your own account and password(if any)
8. `npm i express pg` to install Express for the server and node-postgres (pg) to be able to connect to PostgreSQL
9. run `node index.js`, list of all users in json format available on http://localhost:8001/users
