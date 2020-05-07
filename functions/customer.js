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
                let oid = ordersjson[ord].orderid
                let restaurant = ordersjson[ord].restaurantname
                let address = ordersjson[ord].addresstext
                let postalcode = ordersjson[ord].postalcode
                let orderNow = {orderid: oid, restaurant: restaurant, address: address, postalcode: postalcode}
                orders.push(orderNow)
            }
            response.render("customer/home", {Orders: orders})
        })
    }
}

let getProfile = (request, response) => {
    let address = new Object()
    Request(Constants.serverURL + 'customers/address/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        address = JSON.parse(body)
    })
    
    Request(Constants.serverURL + 'customers/' + Shared.currentUserID, (error, res, body) => {
        let customerinfo = JSON.parse(body)[0]
        let rewardPoints = customerinfo.rewardpoints
        let creditcardnumber = customerinfo.creditcardnumber
        response.render("customer/profile", {
            rewardPoints: rewardPoints,
            creditcardnumber: creditcardnumber,
            address: address
        })
    })
}

function getAddress() {
    let address = new Object()
    
}

let getPastOrders = (request, response) => {
    let completion = (pastOrders) => {
        response.render("customer/pastOrders", {
            orders: pastOrders
        })
    }
    getPastSummaryList(response, completion)
}

function getPastSummaryList(response, completion) {
Request.get(Constants.serverURL + 'customer/pastorders/' + Shared.currentUserID, (error, res, body) => {
    if (error) {
        console.log(error)
        response.render("error", Errors.backendRequestError)
        return
    }
    var pastOrders = JSON.parse(body);
    completion(pastOrders)
})
}

const createReview = (request, response) => {
    let orderId = request.body.orderid
    let rating = request.body.rating
    let review = request.body.review

    let options = {
        url: Constants.serverURL + 'reviews/' + Shared.currentUserID, 
        form: {
            orderId: orderId, 
            rating: rating, 
            review: review
        }
    }

    Request.post(options, (error, res, body) => {

        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        if(res.statusCode == 500) {
            response.render("error",  {errorMessage: "rating and review for this order already exists!" })
        } else if (res.statusCode == 200) {
            response.redirect(302, "/customer/home")
        } else {
            response.render("error")
        }
    })
}


module.exports = {
    showCustomerHome,
    getProfile,
    getPastOrders,
    createReview
}