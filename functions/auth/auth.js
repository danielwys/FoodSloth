const Request = require('request')

const Constants = require('../constants')

const serverURL = 'http://localhost:8001/'

/**
 * Login & Signup
 */

const showLogin = (request, response) => {
    response.render("customer/login")
}

const signIn = (request, response) => {
    let username = request.body.username
    let password = request.body.password

    let options = {
        url: serverURL + 'login',
        form: {
            username: username,
            password: password
        }
    };

    Request.post(options, (error, res, body) => {
        if (error) {
            console.log(error)
            res.render("error")
            return
        }
        console.log(body)

        if (body == "[]") {
            res.render("error");
        } else {
            let userInfo = JSON.parse(body)
            currentUserID = userInfo[0].uid
            currentUserType = userInfo[0].type
            response.render("user/userMain");
        }
    });
}

const createCustomer = (request, response) => {
    let name = request.body.name
    let username = request.body.username
    let password = request.body.password
    let creditCardNumber = request.body.creditCardNumber

    let createCustomerRecord = (cid) => {
        let options = {
            url: serverURL + 'customers/create',
            form: {
                cid: cid,
                cname: name,
                creditCardNumber: creditCardNumber
            }
        }

        Request.post(options, (error, res, body) => {
            if (error) {
                response.render("error")
            }
            if (body = "success") {
                response.redirect(302, "login")
            } else {
                response.render("error")
            }
        })
    }

    createNewUser(username, password, "customer", response, createCustomerRecord)
}

const createRider = (request, response) => {
    let username = request.body.username
    let password = request.body.password
    let partTime = (request.body.partTime == 'Part Time')

    let createRiderRecord = (riderid) => {
        let options = {
            url: serverURL + 'rider/create',
            form: {
                riderid: riderid,
                parttime: partTime
            }
        }
        Request.post(options, (error, res, body) => {
            if (error) {
                response.render("error")
            }
            if (body = "success") {
                response.redirect(302, "rider")
            } else {
                response.render("error")
            }
        })
    }

    createNewUser(username, password, "rider", response, createRiderRecord)
}

const createRestaurant = (request, response) => {
    let username = request.body.username
    let password = request.body.password
    let restName = request.body.name
    let minOrder = request.body.minOrder
    let deliveryFee = request.body.deliveryFee

    let createRestaurantRecord = (restid) => {
        let options = {
            url: serverURL + 'restaurants/create', 
            form: {
                restaurantid: restid, 
                restaurantname: restName, 
                minorder: minOrder, 
                deliveryfee: deliveryFee
            }
        }

        Request.post(options, (error, res, body) => {
            if (error) {
                response.render("error")
            }
            if (body = "succes") {
                response.redirect(302, "restaurant")
            } else {
                response.render("error")
            }
        })
    }

    createNewUser(username, password, "restaurant", response, createRestaurantRecord)
}

function createNewUser(username, password, type, response, completion) {
    let options = {
        url: serverURL + 'register',
        form: {
            username: username,
            password: password,
            type: type
        }
    };

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error")
        }
        let result = JSON.parse(body)
        completion(result[0].uid)
    })
}

module.exports = {
    showLogin,
    signIn, 
    createCustomer,
    createRider,
    createRestaurant
}