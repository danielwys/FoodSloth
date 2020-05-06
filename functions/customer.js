const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let showCustomerHome = (request, response) => {
    if (Shared.notLoggedIn()) {
        response.render("error", Errors.notLoggedIn)
    } else if (Shared.wrongUserType("customer")) {
        response.render("error", Errors.incorrectUserType)
    } else {
        Request(Constants.serverURL + 'customers/orders/' + Shared.currentUserID, (error, res, body) => {
            let ordersjson = JSON.parse(body)
            let orders = []

            for (const ord in ordersjson) {
                let restaurant = ordersjson[ord].restaurantname
                let totalCost = '$10'
                let timeDelivered = '5 May 2020'
                let orderNow = {restaurant: restaurant, totalCost: totalCost, timeDelivered: timeDelivered}
                orders.push(orderNow)
            }
            response.render("customer/home", {Orders: orders})
        })
    }
}

let getProfile = (request, response) => {
    response.render("customer/profile", {
        rewardPoints: "", 
        creditCardNo: ""
    })
}

module.exports = {
    showCustomerHome,
    getProfile
}