const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let showRiderHome = (request, response) => {

    if (Shared.notLoggedIn()) {
        response.render("error", Errors.notLoggedIn)

    } else if (Shared.wrongUserType("rider")) {
        response.render("error", Errors.incorrectUserType)
        
    } else {
        let completion = (riderInfo) => {
            var availability = riderInfo.availability
            var type = riderInfo.type
            var rating = riderInfo.rating
            var salary = riderInfo.salary
            var commission = riderInfo.commission

            if (availability === "y") {
                availability = "True"
            }

            if (type === "y") {
                type = "Part Time"
            } else {
                type = "Full Time"
            }

            if (rating === null) {
                rating = "No ratings yet."
            }

            if (commission === null) {
                commission = "No commission earned yet."
            }

            response.render("rider/home", {
                availability: availability,
                type: type,
                rating: rating,
                salary: salary,
                commission: commission
            })
        }
        getRiderInfo(response, completion)
    }
}

function getRiderInfo(response, completion) {
    Request(Constants.serverURL + 'rider/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let riderInfo = JSON.parse(body)[0]

        completion(riderInfo)

    })
}

let showRiderCurrentOrders = (request, response) => {
    let completion = (riderOrders) => {
        response.render("rider/currentOrders", {
            orders: riderOrders
        })
    }

    getRiderCurrentOrders(response, completion)
}

function getRiderCurrentOrders(response, completion) {
    Request(Constants.serverURL + 'rider/orders/current/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let riderOrders = JSON.parse(body)

        completion(riderOrders)
    })
}

let showRiderPastOrders = (request, response) => {
    let completion = (riderOrders) => {
        response.render("rider/pastOrders", {
            orders: riderOrders
        })
    }

    getRiderPastOrders(response, completion)
}

function getRiderPastOrders(response, completion) {
    Request(Constants.serverURL + 'rider/orders/past/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let riderOrders = JSON.parse(body)

        completion(riderOrders)
    })
}

let markArrived = (request, response) => {
    const orderId = parseInt(request.params.orderId)
    Request(Constants.serverURL + 'orderTimes/riderArrives/' + orderId, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        if (body == "success") {
            response.redirect(302, "/rider/orders/current")
        } else {
            response.render("error")
        }
        
    })
}

let markDeparted = (request, response) => {
    const orderId = parseInt(request.params.orderId)
    Request(Constants.serverURL + 'orderTimes/riderCollects/' + orderId, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        if (body == "success") {
            response.redirect(302, "/rider/orders/current")
        } else {
            response.render("error")
        }
        
    })
}

let markDelivered = (request, response) => {
    const orderId = parseInt(request.params.orderId)
    Request(Constants.serverURL + 'orderTimes/riderDelivers/' + orderId, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        if (body == "success") {
            response.redirect(302, "/rider/orders/current")
        } else {
            response.render("error")
        }
        
    })
}

module.exports = {
    showRiderHome,
    showRiderCurrentOrders,
    showRiderPastOrders,
    markArrived,
    markDeparted,
    markDelivered
}