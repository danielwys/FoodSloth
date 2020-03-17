require('dotenv').config();

const dbHelper = require('../dbHelper');
const userValues = require('./populateUser');
const catagoryValues = require('./populateCat');
const projectValues = require('./populateProject');
const projectCatValues = require('./populateProjCat');
const investValues = require('./populateInvest');

dbHelper.executeQueriesInOrder(
    userValues.query,
    catagoryValues.query,
    projectValues.query,
    // projectCatValues.query,
    investValues.query
);