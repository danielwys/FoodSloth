const pg = require('pg');
const express = require('express');
const executer = require('../database/dbExecuter.js');
const router = express.Router();

router.post('/register', function(req, res, next) {

    // id can be generated server side, can use the DB code thingy
    // when it gets a create user request then it generates a hash
    var username = req.body.username;
    var admin = req.body.admin;
    var password = req.body.password;
    // var joined = req.body.joined; //probably can be server side or use
    // DB code, like just get the current date when creating user
    var email = req.body.email;

    // send to db to check if user can be registered

    // if success
    res.sendStatus(200);

    // if failure
    console.log(err); //for debugging purposes
    res.send(err);
});

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    // var password = req.body.password;

    // send to db to check if user can be authenticated
    var promise = executer.getUser(req.body.username);
    promise.then(results => {
        if (results.rows.length > 0) {
            // if success
            username = results.rows[0].username;
            res.sendStatus(200);
        } else {
            errorMessage = 'Your username is not registered.';
            // if failure
            console.log(err); //for debugging purposes
            res.send(err);
        }
        // res.redirect(req.get('referer'));
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(401);
    })
});

module.exports = router;