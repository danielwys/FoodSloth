require('dotenv').config();

const pg = require('pg');
const queries = require('./query/allStatements');
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

function executeAndLog(query, args) {
    let summary = query.substring(0, 50);
    console.log("%s...: EXECUTING", summary);
    console.log(query);
    let promise = pool.query(query, args).then(result => {
        console.log("%s...: SUCCESS. Returned %d rows.", summary, result.rowCount);
        return result;
    }).catch(e => {
        console.log("%s...: ERROR. Reason: %s %s", summary, e.name, e.message);
    });
    return promise;
}


exports.getAllProjects = function(title, categories) {
    title = title || '';
    title = '%' + title + '%';
    let temp = [];
    var params = [title];
    var stmt = queries.GET_ALL_PROJECTS;
    if(categories!==undefined && categories.length>0) {
        let categoryArr = [];
        if (typeof(categories)=='string') {
            params.push(categories);
            var insertIdx = stmt.indexOf('ORDER BY');
            stmt = stmt.slice(0,insertIdx) + 'AND pr.category=$2 ' + stmt.slice(insertIdx);
        } else {
            for(var i=2; i<=categories.length+1;i++) {
                temp.push('$'+i);
            }
            params = params.concat(categories);
            var insertIdx = stmt.indexOf('ORDER BY');
            stmt = stmt.slice(0,insertIdx) + 'AND pr.category IN ('+temp.join(',')+') ' + stmt.slice(insertIdx);
        }
    }
    return executeAndLog(stmt, params);
}

exports.getAllProjectsAdmin = function() {
    return executeAndLog(queries.GET_ALL_PROJECTS_ADMIN);
}

exports.getFeaturedProjects = function() {
    return executeAndLog(queries.GET_FEATURED_PROJECTS);
}

exports.getAllProjectsByCat = function(category) {
    return executeAndLog(queries.GET_ALL_PROJECTS_BY_CAT, [category]);
}

exports.getAllProjectsByName = function(name) {
    return executeAndLog(queries.GET_ALL_PROJECTS_BY_NAME, [name]);
}

exports.getProjectById = function(pid) {
    return executeAndLog(queries.GET_PROJECT_BY_ID, [pid]);
}

exports.getProjectBackersById = function(pid) {
    return executeAndLog(queries.GET_PROJECT_BACKERS_BY_ID, [pid]);
}

exports.getFundedProjects = function() {
    return executeAndLog(queries.GET_PROJECTS_FUNDED);
}

exports.getUnFundedProjects = function() {
    return executeAndLog(queries.GET_PROJECTS_UNFUNDED);
}

exports.deleteProjectById = function(pid) {
    return executeAndLog(queries.DELETE_PROJECT, [pid]);
}

exports.addProject = function addProject(username, title, category, description, startdate, enddate,
    amountrequested) {
    console.log('Attemping to add project under ' + username);
    return executeAndLog(queries.ADD_PROJECT, [
        username, title, category, description, startdate, enddate, amountrequested
    ]);
}

exports.updateProject = function (pid, title, category, description,
    end_date, amount_sought) {

    console.log('attemping to edit project ' + pid + ': ' + title);
    return executeAndLog(queries.UPDATE_PROJECT, [
        title, description, category, end_date, amount_sought, pid
    ]);
}

exports.removeProjectCategories = function (pid) {
    console.log('Removing all project ' + pid + ' project categories');
    return executeAndLog(queries.REMOVE_PROJECT_CATEGORIES, [pid]);
}

exports.addProjectCategory = function (pid, category) {
    console.log('Adding project ' + pid + ' project categories');
    return executeAndLog(queries.ADD_PROJECT_CATEGORY, [pid, category]);
}

exports.getProjectInvestment = function() {
    return executeAndLog(queries.GET_PROJECT_INVESTMENT_AMOUNT);
}

// USERs

exports.getAllUsers = function() {
    return executeAndLog(queries.GET_ALL_USERS);
}

exports.addUser = function addUser(username, fullname, email, dob,
    country, role) {

    console.log('Attemping to add account ' + username);
    return executeAndLog(queries.ADD_USER, [
        username, fullname, email, dob, country, role
    ]);
}

exports.getUser = function(username) {
    return executeAndLog(queries.GET_USER, [username]);
}

exports.deleteUser = function(username) {
    return executeAndLog(queries.DELETE_USER, [username]);
}

exports.getProjectByUser = function(username) {
    return executeAndLog(queries.GET_PROJECT_BY_USER, [username]);
}

exports.getProjectInvestedByUser = function(username) {
    return executeAndLog(queries.GET_USER_PROJECTS_INVESTED, [username]);
}

// Investing

exports.investProject = function (investor, project_id, 
    amount) {
        console.log('Attemping to add investment under project id ' + project_id);
    return executeAndLog(queries.ADD_INVESTMENT, [
       investor, project_id, amount
    ]);
}

exports.deleteInvestment = function(username) {
    return executeAndLog(queries.DELETE_INVESTMENT, [invest_id]);
}

// Others

exports.getCategories = function() {
    console.log('attempting to get all available categories');
    return executeAndLog(queries.GET_CATEGORIES);
}

exports.addCategory = function(category) {
    console.log('adding category: ' + category);
    return executeAndLog(queries.ADD_CATEGORY);
}

exports.getInvestmentsByMonthStats = function() {
    console.log('attempting to get investments group by Month stat');
    return executeAndLog(queries.GET_INVESTMENTS_BY_MONTH);
}

exports.getInvestmentsByDayStats = function() {
    console.log('attempting to get investments group by Day stat');
    return executeAndLog(queries.GET_INVESTMENTS_BY_DAY);
}

exports.getAmountLeaderboard = function() {
    console.log('attempting to get leaderboard by invested amount');
    return executeAndLog(queries.GET_INVEST_AMOUNT_LEADERBOARD);
}

exports.getAmountLeaderboardTotal = function() {
    console.log('attempting to get Total invested amount');
    return executeAndLog(queries.GET_INVEST_AMOUNT_TOTAL);
}

exports.getProjectsLeaderboard = function() {
    console.log('attempting to get leaderboard by number of projects');
    return executeAndLog(queries.GET_INVEST_PROJECT_LEADERBOARD);
}

exports.getProjectsLeaderboardTotal = function() {
    console.log('attempting to get Total number of projects invested');
    return executeAndLog(queries.GET_INVEST_PROJECT_TOTAL);
}