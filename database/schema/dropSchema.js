require('dotenv').config();

const dbHelper = require('../dbHelper');

const userQuery = 'DROP TABLE users;';
const catagoryQuery = 'DROP TABLE category;';
const projectQuery = 'DROP TABLE project;';
const projectCatagoryQuery = 'DROP TABLE project_category;'
const investmentQuery = 'DROP TABLE investment;';
const investmentViewQuery = 'DROP FUNCTION projectInvestment(INT);';

dbHelper.executeQueriesInOrder(investmentViewQuery, investmentQuery, 
		// projectCatagoryQuery, 
		projectQuery, userQuery, catagoryQuery)
    .then( () => console.log("Drop/Delete tables done!") );
