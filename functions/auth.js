const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

/**
 * Login & Signup
 */

const showCustomerLogin = (request, response) => {
    response.render("customer/login")
}

const showRiderLogin = (request, response) => {
    response.render("rider/login")
}

const showRestaurantLogin = (request, response) => {
    response.render("restaurant/login")
}

const showManagerLogin = (request, response) => {
    response.render("manager/login")
}

const signInCustomer = (request, response) => {
    let username = request.body.username
    let password = request.body.password

    let completion = (uid, type) => {
        if (type == 'customer') {
            Shared.currentUserID = uid
            Shared.currentUserType = type

            //get order details
            //Request(Constants.serverURL + )

            response.render("customer/home", {Orders: [{"restaurant":"Ted's"}, {"restaurant":"Mosby"}]})
        } else {
            response.render("error", Errors.incorrectUserType)
        }
    }

    login(username, password, response, completion)

}

const signInRider = (request, response) => {
    let username = request.body.username
    let password = request.body.password

    let completion = (uid, type) => {
        if (type == 'rider') {
            Shared.currentUserID = uid
            Shared.currentUserType = type

            response.redirect(302, "/rider/home")
        } else {
            response.render("error", Errors.incorrectUserType)
        }
    }

    login(username, password, response, completion)

}

const signInRestaurant = (request, response) => {
    let username = request.body.username
    let password = request.body.password

    let completion = (uid, type) => {
        if (type == 'restaurant') {
            Shared.currentUserID = uid
            Shared.currentUserType = type

            response.redirect(302, "/restaurant/home")
        } else {
            response.render("error", Errors.incorrectUserType)
        }
    }

    login(username, password, response, completion)

}

const signInManager = (request, response) => {
    let username = request.body.username
    let password = request.body.password

    let completion = (uid, type) => {
        if (type == 'manager') {
            Shared.currentUserID = uid
            Shared.currentUserType = type

            response.redirect(302, "/manager/home")
        } else {
            response.render("error", Errors.incorrectUserType)
        }
    }

    login(username, password, response, completion)
}

function login(username, password, response, completion) {
    let options = {
        url: Constants.serverURL + 'login',
        form: {
            username: username,
            password: password
        }
    };

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        if (body == "[]") {
            response.render("error", Errors.noSuchUserError);
        } else {
            let userInfo = JSON.parse(body)

            let uid = userInfo[0].uid
            let type = userInfo[0].type
            
            completion(uid, type)
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
            url: Constants.serverURL + 'customers/create',
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
            if (body == "success") {
                response.redirect(302, "customer/login")
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
            url: Constants.serverURL + 'rider/create',
            form: {
                riderid: riderid,
                parttime: partTime
            }
        }
        Request.post(options, (error, res, body) => {
            if (error) {
                response.render("error")
            }
            if (body == "success") {
                response.redirect(302, "rider/login")
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
            url: Constants.serverURL + 'restaurants/create', 
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
            if (body == "success") {
                response.redirect(302, "restaurant/login")
            } else {
                response.render("error")
            }
        })
    }

    createNewUser(username, password, "restaurant", response, createRestaurantRecord)
}

function createNewUser(username, password, type, response, completion) {
    let options = {
        url: Constants.serverURL + 'register',
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
    showCustomerLogin,
    showRiderLogin,
    showRestaurantLogin,
    showManagerLogin,
    signInCustomer, 
    signInRider,
    signInRestaurant,
    signInManager,
    createCustomer,
    createRider,
    createRestaurant
}