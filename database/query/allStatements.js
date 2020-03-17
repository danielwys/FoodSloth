// Project Statements

exports.ADD_PROJECT =
    'INSERT INTO project' +
    ' (pid, creator, title, description, category, startdate, enddate, amountrequested, funded)' +
    ' VALUES(DEFAULT, (SELECT users.id FROM users WHERE users.username = $1), $2, $3, $4, $5, $6, $7, FALSE);';

exports.UPDATE_PROJECT =
    'UPDATE project ' +
    ' SET title = $1, description = $2, category = $3, enddate = $4, amountrequested = $5' +
    ' WHERE pid = $6';

exports.REMOVE_PROJECT_CATEGORIES =
    'DELETE FROM project_category ' +
    'WHERE pid = $1';

exports.ADD_PROJECT_CATEGORY =
    'INSERT INTO project_category ' +
    ' (pid, name)' +
    ' VALUES($1, $2)';

exports.GET_ALL_PROJECTS =
    'SELECT pr.pid, pr.creator, pr.title, pr.description,' +
    ' to_char(pr.startdate, \'DD-MM-YYYY\'),' +
    ' to_char(pr.enddate, \'DD-MM-YYYY\'), pr.amountrequested, ' +
    ' u.username, u.fullname, u.country' +
    ' FROM project pr, users u ' +
    ' WHERE pr.creator = u.id ' +
    ' AND UPPER(pr.title) LIKE UPPER($1) '
    ' ORDER BY pr.title';

exports.GET_ALL_PROJECTS_ADMIN = 
    'SELECT pr.pid, pr.title, pr.description,' +
    ' to_char(pr.startdate, \'DD-MM-YYYY\'),' +
    ' to_char(pr.enddate, \'DD-MM-YYYY\'), pr.amountrequested, ' +
    ' u.username, projectInvestment(pid) AS amountfunded' +
    ' FROM project pr' +
    ' LEFT JOIN users u ON pr.creator = u.id' +
    ' ORDER BY pr.pid;'

exports.GET_FEATURED_PROJECTS =
    'SELECT pr.pid, pr.creator, pr.title, pr.description,' +
    ' to_char(pr.startdate, \'DD-MM-YYYY\'),' +
    ' to_char(pr.enddate, \'DD-MM-YYYY\'), pr.amountrequested, ' +
    ' ((SELECT SUM(investment.amount) FROM investment WHERE investment.project = pr.pid) / pr.amountrequested) AS percentage, ' +
    ' u.username, u.fullname, u.country' +
    ' FROM project pr, users u ' +
    ' WHERE pr.creator = u.id ' +
    ' ORDER BY percentage ASC' +
    ' LIMIT 12';

exports.GET_ALL_PROJECTS_BY_CAT =
    'SELECT pid, creator, title, description,' +
    ' to_char(startdate, \'DD-MM-YYYY\'),' +
    ' to_char(enddate, \'DD-MM-YYYY\'), amountrequested' +
    ' FROM project p' +
    ' WHERE p.category = $1' +
    ' ORDER BY title';

exports.GET_ALL_PROJECTS_BY_NAME =
    'SELECT pid, creator, title, description,' +
    ' to_char(startdate, \'DD-MM-YYYY\'),' +
    ' to_char(enddate, \'DD-MM-YYYY\'), amountrequested' +
    ' FROM project p' +
    ' WHERE p.name LIKE %$1%' +
    ' ORDER BY title';

exports.GET_PROJECT_INVESTMENT_AMOUNT =
    'SELECT * FROM project pr WHERE pr.pid = $1';

exports.GET_PROJECTS =
    'SELECT pr.pid, pr.title, pr.description, pr.owner_account, usr.fullname as owner, usr.country as owner_country ' +
    'FROM project pr '+
    'INNER JOIN users usr ON usr.id=pr.owner_account '+
    'WHERE UPPER(pr.title) LIKE UPPER($1) '+
    'ORDER BY pr.title';

exports.GET_PROJECT_BY_ID =
    'SELECT pr.pid, pr.title, pr.description, pr.creator, pr.category, ' +
    'pr.startdate, pr.enddate, pr.amountrequested, pr.funded, ' +
    'DATE_PART(\'day\', pr.enddate::timestamp - pr.startdate::timestamp) as daysleft, ' +
    '(SELECT SUM(investment.amount) FROM investment WHERE investment.project = pr.pid) AS amountfunded, ' +
    'users.fullname AS owner, users.country AS ownercountry, users.username AS ownerusername ' +
    'FROM project pr INNER JOIN users ON pr.creator = users.id WHERE pr.pid = $1';

exports.GET_PROJECT_BACKERS_BY_ID =
    'SELECT u.username, i.amount, i.date ' +
    'FROM users u, investment i ' +
    'WHERE i.investor = u.username ' +
    'AND i.project = $1 ' +
    'ORDER BY i.date;';


exports.GET_PROJECT_BY_USER =
    'SELECT * FROM project pr, users u ' +
    'WHERE pr.creator = u.id ' +
    'AND u.username = $1';

exports.GET_PROJECTS_FUNDED =
    'SELECT * FROM project pr WHERE pr.funded = TRUE';

exports.GET_PROJECTS_UNFUNDED =
    'SELECT * FROM project pr WHERE pr.funded = FALSE';

exports.DELETE_PROJECT =
    'DELETE FROM project pr WHERE pr.pid = $1';

// User Statements

exports.ADD_USER =
    'INSERT INTO users' +
    ' (username, fullname, email, dob, country, admin)' +
    ' VALUES($1, $2, $3, $4, $5, $6)';

exports.GET_ALL_USERS =
    'SELECT * FROM users';

exports.GET_USER =
    'SELECT * FROM users WHERE username = $1';

exports.DELETE_USER =
    'DELETE FROM users WHERE username = $1';

exports.GET_USER_PROJECTS_INVESTED =
    'SELECT p.title, SUM(i.amount) AS invested' +
    ' FROM project p, investment i' +
    ' WHERE p.pid = i.project' +
    ' AND i.investor = $1' +
    ' GROUP BY p.title;';


// Other APIs

exports.GET_CATEGORIES =
    'SELECT * FROM category ORDER BY name';

exports.ADD_CATEGORY =
    'INSERT INTO category ' +
    ' (category)' +
    ' VALUES($1)';
    
exports.ADD_INVESTMENT =
    'INSERT INTO investment' +
    ' (id, investor, project, amount, date)' +
    ' VALUES (DEFAULT, $1, $2, $3, CURRENT_DATE)';

exports.DELETE_INVESTMENT =
    'DELETE FROM investment' +
    ' WHERE id = $1;';


// Fun stats?

exports.GET_INVESTMENTS_BY_MONTH =
    'SELECT TO_CHAR(date, \'MM\'), SUM(amount)' +
    ' FROM investment' +
    ' GROUP BY TO_CHAR(date, \'MM\')' +
    ' ORDER BY 1;'

exports.GET_INVESTMENTS_BY_DAY =
    'SELECT TO_CHAR(date, \'DD\'), SUM(amount)' +
    ' FROM investment' +
    ' GROUP BY TO_CHAR(date, \'DD\')' +
    ' ORDER BY 1;'



exports.GET_INVEST_AMOUNT_LEADERBOARD =
    'SELECT u.username, SUM(i.amount) AS totalinvestment' +
    ' FROM users u, investment i' +
    ' WHERE i.investor = u.username' +
    ' GROUP BY u.username' +
    ' ORDER BY totalinvestment DESC;';

exports.GET_INVEST_AMOUNT_TOTAL =
    'SELECT SUM(i.amount) AS totalinvestment' +
    ' FROM investment i;';

exports.GET_INVEST_PROJECT_LEADERBOARD =
    'SELECT u.username, COUNT(DISTINCT i.project) AS numberProjects' +
    ' FROM users u, investment i' +
    ' WHERE i.investor = u.username' +
    ' GROUP BY u.username' +
    ' ORDER BY numberProjects DESC;';

exports.GET_INVEST_PROJECT_TOTAL =
    'SELECT COUNT(DISTINCT i.project) AS numberProjectsInvested' +
    ' FROM investment i;';