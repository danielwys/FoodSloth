const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let currentRestaurantList = []
let currentRestaurant = ""
let orderedItems = []

let getAllOrders = (request, response) => {
    Request(Constants.serverURL + 'stats/order/ordersPerCustomer/' + Shared.currentUserID,
    (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        let ordersjson = JSON.parse(body)
        orders = []

        var i = 1
        for (ord in ordersjson) {
            //decide what info rgd past & present orders
            //to show on the dashboard
        }
    })
}

let selectRestaurant = (request, response) => {
    Request(Constants.serverURL + 'restaurants', (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let restaurantsjson = JSON.parse(body)
        let restaurants = []

        for (restaurant in restaurantsjson) {
            currentRestaurant = restaurantsjson[restaurant]
            restaurants.push(currentRestaurant.restaurantname)
        }

        response.render("customer/selectRestaurant", { Restaurants: restaurants })
    })
}

let selectItems = (request, response) => {
    if (request.body.dropDown != null) {
        currentRestaurant = request.body.dropDown
    } else {
        let item = request.body.dropDown1
        let quant = request.body.dropDown2
        let newItem = {item: item, quantity: quant}
        orderedItems.push(newItem)
    }
    Request(Constants.serverURL + 'menu/show/' + currentRestaurant, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        
        let itemsjson = JSON.parse(body)
        
        response.render("customer/selectFoodItems", {
            title: "Select Food",
            Restaurant: currentRestaurant,
            orderItems: orderedItems,
            Items: itemsjson,
        })
    })
}

module.exports = { 
    selectRestaurant,
    selectItems
}

