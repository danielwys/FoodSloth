const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let currentRestaurantList = []
let currentRestaurant = ""
let restaurantId = -1;
let orderedItems = []
let address = ""
let aid = -1;
let deliveryFee = -1;
let byCash = false;

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
        Request(Constants.serverURL + 'restaurants/find/' + currentRestaurant, 
        (err, res, body) => {
            restaurantId = (JSON.parse(body)[0]).restaurantid
            deliveryFee = (JSON.parse(body)[0]).deliveryfee
        })
    } else if (request.body.dropDown1 == undefined || request.body.dropDown2 == undefined) {
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
        //console.log('reached here')
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        
        //console.log(JSON.parse(body))
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
        response.render("customer/selectAddress", {
            Restaurant: currentRestaurant,
            orderedItems: orderedItems, 
            Address: address
        })    
    })
}

let openAddAddress = (request, response) => {
    response.render("customer/addAddress")
}

let addAddress = (request, response) => {
    let area = request.body.area
    let addressText = request.body.addressText
    let postalCode = request.body.postalCode

    let options = {
        url: Constants.serverURL + 'customers/adress/add/' + Shared.currentUserID, 
        form: {
            uid: Shared.currentUserID,
            area: area, 
            addressText: addressText, 
            postalCode: postalCode
        }
    }

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        if(res.statusCode == 500) {
            response.render("duplicateError",  {errorMessage: body })
        } else if (res.statusCode == 200) {
            response.redirect(302, "/customer/selectAddress")
        } else {
            response.render("error")
        }
    })
}


let selectPayment = (request, response) => {
    if (request.body.dropDown3 != undefined) {
        address = request.body.dropDown3
    }
    if (aid == -1) {
        updateAid(address)
    }

    Request(Constants.serverURL + 'customers/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        let creditcards = JSON.parse(body)
        response.render("customer/selectPayment", {
            Restaurant: currentRestaurant,
            orderedItems: orderedItems, 
            Address: address, 
            creditcardnumber: creditcards})    
    })
}

function updateAid(address) {
    aid = 0;
    for (var i = 1; i < address.length; i++) {
        if (address.charAt(i) == ")") {
            aid = parseInt(aid)
            break
        } else {
            aid += address.charAt(i)
        }
    }
}

let openUpdateCreditcardnumber = (request, response) => {
    response.render("customer/updateCreditcardnumber")
}

let updateCreditcardnumber = (request, response) => {
    let cardNumber = request.body.cardNumber

    let options = {
        url: Constants.serverURL + 'customers/' + Shared.currentUserID, 
        form: {
            cardNumber: cardNumber
        }
    }

    Request.post(options, (error, res, body) => {

        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        if(res.statusCode == 500) {
            response.render("duplicateError",  {errorMessage: body })
        } else if (res.statusCode == 200) {
            response.redirect(302, "/customer/selectPayment")
        } else {
            response.render("error")
        }
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

let finaliseOrder = (request, response) => {
    payment = request.body.dropDown4
    if (payment == "Cash payment") {
        byCash = true;
    }

    let total = 0

    for (ord in orderedItems) {
        let price = (orderedItems[ord].price).slice(1)
        total += parseFloat(price) * orderedItems[ord].quantity
    }
    total = Math.round(total * 100) / 100

    response.render("customer/finaliseOrder", {
        Restaurant: currentRestaurant,
        orderedItems: orderedItems, 
        Total: total, 
        Address: address, 
        Payment: payment
    })
}

let addPromo = (request, response) => {
    code = request.body.code

    Request(Constants.serverURL + 'custPromo/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        let custPromo = JSON.parse(body)
        //console.log(creditcards)
        response.render("customer/addPromo", {
            orderedItems: orderedItems, 
            Total: total, 
            Address: address, 
            Payment: payment
        })    
    })
}

let createOrder = (request, response) => {

    if (!byCash) {
        creditCardNumber = request.payment
    }

    let options = {
        url: Constants.serverURL + 'order/new/' + Shared.currentUserID, 
        form: {
            cid: Shared.currentUserID,
            restaurantId: restaurantId,
            riderId: null,
            aid: aid,
            deliveryFee: deliveryFee,
            byCash: byCash,
            creditCardNumber: creditCardNumber,
            custPromo: null,
            restPromo: null
        }
    }

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        
        if (body == "[]") {
            response.render("error", Errors.backendRequestError)
        } else {
            console.log(body)
            let oid = JSON.parse(body)
            console.log(oid)
            //add fooditem
            //completion(uid, type)
            response.redirect(302, "/customer/home")
        }
    })

}


module.exports = { 
    selectRestaurant,
    selectItems,
    confirmOrder,
    selectAddress,
    openAddAddress,
    addAddress,
    selectPayment,
    openUpdateCreditcardnumber,
    updateCreditcardnumber,
    editOrder,
    deleteItem,
    addPromo,
    finaliseOrder,
    createOrder
}

