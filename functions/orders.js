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
        
        var cont = 0
        for (const val of orderedItems) {
            if (item.localeCompare(val.item) == 0) {
                //item already exists in order list
                val.quantity = parseInt(val.quantity) + parseInt(quant)
                cont = 1
                break
            }
        }

        if (cont == 0) {
            Request(Constants.serverURL + 'menu/show/' + currentRestaurant + '/' + item, 
            (error, res, body) => {
                let price = JSON.parse(body)[0].price
                if (quant != 0) {
                    let newItem = {item: item, price: price, quantity: quant}
                    orderedItems.push(newItem)
                }
            })
        }
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

function confirmOrder(orderedItems) {
    let options =  {
        url: Constants.serverURL + 'menu/show/' + currentRestaurant + '/check',
        form: {
            items: orderedItems
        }
    }
    Request.post(options, (error, res, body) => {
        console.log('reached here')
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        
        console.log(JSON.parse(body))
    })
}

let selectAddress = (request, response) => {
    //confirmOrder(orderedItems)
    Request(Constants.serverURL + 'customers/address/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        let address = JSON.parse(body)
        response.render("customer/selectAddress", {orderedItems: orderedItems, Address: address})    
    })
}

let editOrder = (request, response) => {
    response.render("customer/editOrder", {
        Restaurant: currentRestaurant,
        orderItems: orderedItems,
    })
}

let deleteItem = (request, response) => {
    var item = request.body.edits
    orderedItems.pop(item)
    
    response.render("customer/editOrder", {
        Restaurant: currentRestaurant,
        orderItems: orderedItems,
    })
}

module.exports = { 
    selectRestaurant,
    selectItems,
    confirmOrder,
    selectAddress,
    editOrder,
    deleteItem
}

