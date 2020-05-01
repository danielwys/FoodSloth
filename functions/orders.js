const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let currentRestaurantList = []
let currentRestaurant = ""
let orderedItems = []


let selectRestaurant = (request, response) => {
    Request(Constants.serverURL + 'restaurants', (error, res, body) => {
        if (error) {
            console.log(error)
            response.render("error", Errors.backendRequestError)
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
    Request(Constants.serverURL + 'menu/' + currentRestaurant, (error, res, body) => {
        let itemsjson = JSON.parse(body)
        let items = []
        let quantity = []

        for (it in itemsjson) {
            currentItem = itemsjson[it].foodname
            currentQty = itemsjson[it].maxavailable
            items.push(currentItem)
            quantity.push(currentQty)
        }
        
        response.render("customer/selectFoodItems", {
            title: "Select Food",
            Restaurant: currentRestaurant,
            orderItems: orderedItems,
            //Items: items,
            Items: itemsjson,
            Quantity: quantity
        })
    })
}

module.exports = { 
    selectRestaurant,
    selectItems
}

