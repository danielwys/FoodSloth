require('dotenv').config();

const dbHelper = require('../dbHelper');

const userQuery =
	'CREATE TABLE users (' +
        'id SERIAL PRIMARY KEY,' +
		'username VARCHAR(32) UNIQUE NOT NULL,' +
		'fullname VARCHAR(64) NOT NULL,' +
		'email VARCHAR(256),' +
		'dob DATE,' +
		'country VARCHAR(64),' +
		'admin BOOLEAN' +
	');';


const catagoryQuery = 
    'CREATE TABLE category (' +
        'name VARCHAR(64) PRIMARY KEY,' +
        'description VARCHAR(1024)' +
    ');';

const projectQuery = 
	'CREATE TABLE project (' +
		'pid SERIAL PRIMARY KEY,' +
		'creator INTEGER REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,' +
		'title VARCHAR(256),' +
		'description VARCHAR(256),' +
		'category VARCHAR(64) REFERENCES category(name),' +
		'startdate DATE NOT NULL,' +
		'enddate DATE NOT NULL,' +
		'amountrequested BIGSERIAL,' +
		'funded BOOLEAN' +
	');';

const projectCatagoryQuery =
    'CREATE TABLE project_category ( ' +
        'pid INT REFERENCES project(pid), ' +
        'name VARCHAR(64) REFERENCES category(name) ' +
    ');';

const investmentQuery = 
    'CREATE TABLE investment (' +
        'id SERIAL PRIMARY KEY,' +
        'investor VARCHAR(32) REFERENCES users(username) ON DELETE SET NULL,' +
        'project INT REFERENCES project(pid) ON DELETE SET NULL,' +
        'amount DECIMAL CHECK(amount > 0),' +
        'date DATE' +
    ');';

const investmentFunctionQuery = 
    'CREATE OR REPLACE FUNCTION projectInvestment(projectid INT) ' +
        'RETURNS DECIMAL AS $$ ' +
        'DECLARE totalinvestment DECIMAL; ' +
        'BEGIN ' +
        'SELECT SUM(i.amount) INTO totalinvestment ' +
        'FROM investment i, project p ' +
        'WHERE projectid = p.pid ' +
        'AND i.project = p.pid; ' +
        'RETURN totalinvestment; ' +
        'END; $$ ' +
        'LANGUAGE PLPGSQL;';

const investmentTriggerFunctionQuery =
    'CREATE OR REPLACE FUNCTION addInvestmentTrigger()' +
    ' RETURNS trigger AS ' +
    ' $$' +
    ' BEGIN' +
    ' UPDATE project' +
    ' SET funded = CASE WHEN (projectInvestment(pid) >= amountrequested) THEN true' +
    ' WHEN (projectInvestment(pid) < amountrequested) THEN false' +
    ' END' +
    ' WHERE project.pid = NEW.project;' +
    ' RETURN NULL;' +
    'END;' +
    '$$' +
    'LANGUAGE \'plpgsql\';';

const investmentTriggerQuery =
    'CREATE TRIGGER check_funded ' +
    'AFTER INSERT OR UPDATE ON investment ' +
    'FOR EACH ROW ' +
    'EXECUTE PROCEDURE addInvestmentTrigger();';

const projectTriggerFunctionQuery =
    'CREATE OR REPLACE FUNCTION updateProjectTrigger()' +
    ' RETURNS trigger AS ' +
    ' $$' +
    ' BEGIN' +
    ' UPDATE project' +
    ' SET funded = CASE WHEN (projectInvestment(pid) >= amountrequested) THEN true' +
    ' WHEN (projectInvestment(pid) < amountrequested) THEN false' +
    ' END' +
    ' WHERE project.pid = NEW.pid;' +
    ' RETURN NULL;' +
    'END;' +
    '$$' +
    'LANGUAGE \'plpgsql\';';


const projectTriggerQuery =
    'CREATE TRIGGER check_funded2 ' +
    'AFTER UPDATE OF amountrequested ON project ' +
    'FOR EACH ROW ' +
    'EXECUTE PROCEDURE updateProjectTrigger();';

dbHelper.executeQueriesInOrder(catagoryQuery, userQuery, projectQuery, investmentQuery, 
    investmentFunctionQuery, investmentTriggerFunctionQuery, investmentTriggerQuery,
    projectTriggerFunctionQuery, projectTriggerQuery )
    .then(() => console.log("Make tables done!"));