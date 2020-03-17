require('dotenv').config();

const pg = require('pg');
const express = require('express');
const executer = require('../database/dbExecuter.js');
const Rx = require('rx');
const moment = require('moment');
const capitalize = require('capitalize');


const router = express.Router();

var username = '';
var errorMessage = '';



router.get('/', function(req, res) {
    let categoryObs = Rx.Observable.fromPromise(executer.getCategories());
    let projectsObs = Rx.Observable.fromPromise(executer.getFeaturedProjects());
    Rx.Observable.zip(categoryObs, projectsObs).subscribe(
        (results) => {
            // this will only be executed once all the queries are done
            let categories = results[0].rows;
            let projects = results[1].rows;
            res.render('pages/main', {
                username: username,
                categories: categories,
                projects: projects,
                error: errorMessage
            });
            errorMessage = '';
        },
        (error) => {
            console.log(error);
        }
    );
});

// Project APIs

router.get('/projects', function(req, res) {
    var projects = [];
    console.log(req.query);
    var title = req.query.title ? req.query.title : '';
    var categories = req.query.categories ? req.query.categories : [];
    if (typeof(categories) == 'string') {
        categories = [categories];
    }
    var params = {
        title: title,
        categories: categories
    };
    var promise = executer.getAllProjects(title,categories);
    promise.then(results => {
        projects = results.rows;
        res.render('pages/search', {
            username: username,
            params: params,
            projects: projects,
            error: errorMessage
        });
        errorMessage = '';
    });
});

// router.get('/projects/:category', function(req, res) {
//     var promise = executer.getAllProjectsByCat(req.params['category']);
//     promise.then(results => {
//         return res.json(results.rows);
//     });
// });

// router.get('/projects/:name', function(req, res) {
//     var promise = executer.getAllProjectsByName(req.params['name']);
//     promise.then(results => {
//         return res.json(results.rows);
//     });
// });

router.get('/project/:pid', function(req, res) {
    var projectId = req.params.pid;
    let categoryObs = Rx.Observable.fromPromise(executer.getProjectById(projectId));
    let projectsObs = Rx.Observable.fromPromise(executer.getProjectBackersById(projectId));
    Rx.Observable.zip(categoryObs, projectsObs).subscribe(
        (results) => {
            // let projects = results;
            // if (projects.rowCount == 0) {
            //     res.status(404).send('No such project');
            //     return;
            // }
            // let project = projects.rows[0];
            // console.log(project);
            // return res.json(project);
            var result = results[0].rows[0];
            console.log(results[1]);
            var backerresult = results[1].rows;
            res.render('pages/viewProject', {
                projectId: projectId,
                username: username,
                title: result.title,
                description: result.description,
                owner_account: result.creator,
                category: result.category,
                start_date: result.startdate,
                end_date: result.enddate,
                days_left: result.daysleft,
                backers: backerresult,
                amount_sought: result.amountrequested,
                amount_funded: result.amountfunded,
                is_funded: result.funded,
                percent_funded: parseFloat(parseFloat(result.amountfunded) / parseFloat(result.amountrequested) * 100).toFixed(2),
                owner: result.owner,
                owner_country: result.ownercountry,
                owner_username: result.ownerusername,
                error: errorMessage
            });
            errorMessage = '';
        },
        (error) => {
            console.log(error);
        }
    );
});

router.get('/projects/funded', function(req, res) {
    var promise = executer.getFundedProjects();
    promise.then(results => {
        return res.json(results.rows);
    });
});

router.get('/projects/ongoing', function(req, res) {
    var promise = executer.getUnFundedProjects();
    promise.then(results => {
        return res.json(results.rows);
    });
});

router.get('/my-projects', function(req, res) {
    console.log('username', username);
    executer.getProjectByUser(username).then(result => {
        let projects = result.rows;
        console.log(projects);
        res.render('pages/myProjects', {
            projects: projects,
            username: username,
            error: errorMessage
        });
        errorMessage = '';
    });
});

router.get('/projects/:pid/update', function(req, res) {
    var projectId = req.params['pid'];
    let categoryObs = Rx.Observable.fromPromise(executer.getCategories());
    let currentProjObs = Rx.Observable.fromPromise(executer.getProjectById(projectId));
    Rx.Observable.zip(categoryObs, currentProjObs).subscribe(
        (results) => {

            var categories = results[0].rows;
            var currentProj = results[1].rows[0];
            console.log(currentProj.pid);
            res.render('pages/addEditProject', {
                username: username,
                title: 'Edit project',
                categories: categories,
                project: currentProj,
                formAction: '/project/' + currentProj.pid + '/update',
                formMethod: 'post',
                dateFormat: (date => moment(date).format('YYYY-MM-DD')),
                state: 'update',
                error: errorMessage
            });
            errorMessage = '';
        },
        (error) => {
            console.log(error);
        }
    );
});


router.post('/project/:pid/update', function(req, res) {
    var projectId = req.params['pid'];
    var title = req.body.title;
    var category = req.body.category;
    var description = req.body.description;
    var end_date = req.body.enddate;
    var amount_sought = req.body.amountrequested;

    var promise = executer.updateProject(projectId,
        title, category, description, end_date, amount_sought);

    promise.then(function() {
        res.redirect('/my-projects/'); // to project page
    });
});


router.post('/project/:pid/delete', function(req, res) {
    var promise = executer.deleteProjectById(req.params['pid']);
    promise.then(results => {
        console.log("deleting project " + results);
        res.redirect('back'); // redirect back
    }).catch(function() {
        console.log("Promise rejected");
    });
})

router.get('/projects/add', function(req, res) {
    executer.getCategories().then(results => {
        res.render('pages/addEditProject', {
            username: username,
            title: 'Add project',
            categories: results.rows,
            project: {},
            formAction: '/project',
            formMethod: 'post',
            dateFormat: (date => moment(date).format('YYYY-MM-DD')),
            state: 'add',
            error: errorMessage
        });
        errorMessage = '';
    });
});


router.post('/project', function(req, res, next) {
    var username = req.body.username;
    var title = req.body.title;
    var description = req.body.description;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var amountrequested = req.body.amountrequested;
    var category = req.body.category;
    console.log(req.body);
    var promise = executer.addProject(
        username, title, description, category, startdate, enddate, amountrequested
    );
    promise.then(function() {
        res.redirect('/my-projects/'); // to project page
    });
});

router.post('/projects/:pid', function(req, res, next) {
    var projectId = parseInt(req.params.pid);
    var title = req.body.title;
    var project_categories = req.body.category;
    var description = req.body.description;
    var end_date = req.body.enddate;
    var amount_sought = req.body.amountrequested;
    var owner_account = req.body.creator;
    console.log(req.body);
    var promise = executer.updateProject(
        projectId, title, category, description, end_date, amount_sought
    );
    promise.then(function() {
        res.redirect('/projects/' + projectId); // to project page
    });
    if (project_categories.length > 0) {
        executer.removeProjectCategories(projectId); // removes all project categories and replaces them
        project_categories.forEach(function(element) {
            executer.addProjectCategory(
                projectId, element
            );
        });
    }
});


// User APIs

router.get('/allusers', function(req, res) {
    var promise = executer.getAllUsers();
    promise.then(results => {
        return res.json(results.rows);
    });
});

router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var dob = req.body.dob;
    var country = (req.body.country) ? req.body.country : '';
    var role = req.body.role;
    console.log(role);
    var promise = executer.addUser(username, fullname, email, dob, country, role);
    promise.then(function(result) {
        res.redirect('/'); //redirect back to home
    });
});

router.get('/user/:id', function(req, res) {
    var promise = executer.getUser(req.params['id']);
    promise.then(results => {
        res.redirect('back'); // redirect back
    });
});

router.post('/user/:username/delete', function(req, res) {
    var promise = executer.deleteUser(req.params['username']);
    promise.then(results => {
        res.redirect('back'); // redirect back
    });

});

router.get('/myprojects/:id', function(req, res) {
    console.log('projects by username: ' + req.params['id']);
    executer.getProjectByUser(req.params['id']).then(result => {
        let projects = result.rows;
        return res.json(projects);
    });
});

router.get('/investments/:id', function(req, res) {
    console.log('projects and investments: ' + req.params['id']);
    executer.getProjectInvestedByUser(req.params['id']).then(result => {
        let projects = result.rows;
        return res.json(projects);
    });
});


// Investing APIs

router.post('/invest', function(req, res, next) {
    var investor = req.body.username;
    console.log('current user trying to invest: ' + investor);
    var projectId = req.body.projectId;
    var amount = req.body.amount;
    console.log(req.body);
    var promise = executer.investProject(
        investor, projectId, amount
    );
    promise.then(function() {
        res.redirect('/project/' + projectId); // to project page
    });
});

router.delete('/invest/:id', function(req, res, next) {
    var invest_id = parseInt(req.params.id);
    var promise = executer.deleteInvestment(
        invest_id
    );
    promise.then(function() {
        res.redirect('back'); // to previous page
    });
});
// Other APIs

router.get('/categories', function(req, res) {
    var promise = executer.getCategories();
    promise.then(results => {
        return res.json(results.rows);
    });
})

router.post('/categories', function(req, res, next) {
    var category = req.body.category;
    var promise = executer.addCategory(
        category
    );
    promise.then(function() {
        res.redirect('back'); // to current page
    });
});

router.get('/invest/stats/month', function(req, res) {
    var promise = executer.getInvestmentsByMonthStats();
    promise.then(results => {
        return res.json(results.rows);
    });
})

router.get('/invest/stats/day', function(req, res) {
    var promise = executer.getInvestmentsByDayStats();
    promise.then(results => {
        return res.json(results.rows);
    });
})

router.get('/leaderboard/amount', function(req, res) {
    let summaryObs = Rx.Observable.fromPromise(executer.getAmountLeaderboardTotal());
    let contentObs = Rx.Observable.fromPromise(executer.getAmountLeaderboard());
    Rx.Observable.zip(summaryObs, contentObs).subscribe(results => {
        console.log(results[1]);
        let summary = results[0];
        let content = results[1];
        res.render('stats/index.ejs', {
            username: username,
            reportDescription: 'Leaderboard of top investors by top dollar invested.',
            reportTitle: 'Top Investors by Dollar',
            summary: summary,
            content: content,
            capitalize: capitalize,
            error: errorMessage
        });
        errorMessage = '';
    });
})

router.get('/leaderboard/projects', function(req, res) {
    let summaryObs = Rx.Observable.fromPromise(executer.getProjectsLeaderboardTotal());
    let contentObs = Rx.Observable.fromPromise(executer.getProjectsLeaderboard());
    Rx.Observable.zip(summaryObs, contentObs).subscribe(results => {
        console.log(results[1]);
        let summary = results[0];
        let content = results[1];
        res.render('stats/index.ejs', {
            username: username,
            reportDescription: 'Leaderboard of top investors by Number of Projects invested.',
            reportTitle: 'Top Investors by Projects',
            summary: summary,
            content: content,
            capitalize: capitalize,
            error: errorMessage
        });
        errorMessage = '';
    });
})


router.get('/admin', function(req, res) {
    let projectsObs = Rx.Observable.fromPromise(executer.getAllProjectsAdmin());
    let usersObs = Rx.Observable.fromPromise(executer.getAllUsers());
    Rx.Observable.zip(projectsObs, usersObs).subscribe(
        (results) => {
            var projectresult = results[0].rows;
            console.log(projectresult);
            var userresult = results[1].rows;
            res.render('pages/admin', {
                username: username,
                projects: projectresult,
                users: userresult,
                error: errorMessage
            });
            errorMessage = '';
        },
        (error) => {
            console.log(error);
        }
    );
});


router.post('/login', function(req, res, next) {
    var promise = executer.getUser(req.body.username);
    promise.then(results => {
        if (results.rows.length > 0) {
            username = results.rows[0].username;
            isuseradmin = results.rows[0].admin;
        } else {
            errorMessage = 'Your username is not registered.';
        }
        res.redirect(req.get('referer'));
    });
});

router.get('/logout', function(req, res, next) {
    if (username !== "") username = "";
    res.redirect(req.get('referer'));
});

module.exports = router;