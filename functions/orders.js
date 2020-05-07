const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let currentRestaurant = ""
let restaurantId = -1;
let orderedItems = []
let address = ""
let aid = -1;
let deliveryFee = -1;
let byCash = false;
let total = 0;
let promo = 0;

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
    resetOrder()
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
        
        Request(Constants.serverURL + 'menu/show/' + currentRestaurant + '/check/' + item, 
        (error, res, body) => {
        if (error) {
            res.render("error", Errors.backendRequestError)
            return
        }
        let num = JSON.parse(body)[0]
        let ans = num.maxavailable - quant

            var cont = 0
            for (const val of orderedItems) {
                if (item.localeCompare(val.item) == 0) {
                    //item already exists in order list
                    quant = parseInt(val.quantity) + parseInt(quant)
                    if (ans < 0) {

                    } else {
                        val.quantity = quant
                        cont = 1
                        break
                    }
                }
            }


            if (cont == 0 && ans >= 0) {
                Request(Constants.serverURL + 'menu/show/' + currentRestaurant + '/' + item, 
                (error, res, body) => {
                    let price = JSON.parse(body)[0].price
                    if (quant != 0) {
                        let newItem = {item: item, price: price, quantity: quant}
                        orderedItems.push(newItem)
                    }
                })
            }
        })
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


let selectAddress = (request, response) => {
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
        } else if (restaurantId == -1) {
            response.redirect(302, "/customer/profile")
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
        } else if (restaurantId == -1) {
            response.redirect(302, "/customer/profile")
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
    if (request.body.dropDown4 == "") {
        addPromo()
    } else {
        payment = request.body.dropDown4
        if (payment == "Cash payment") {
            byCash = true;
        }
    }
    
    let total = 0

    for (ord in orderedItems) {
        let price = (orderedItems[ord].price).slice(1)
        total += parseFloat(price) * orderedItems[ord].quantity
    }
    total = Math.round(total * 100) / 100 
    final = total - promo + deliveryFee

    response.render("customer/finaliseOrder", {
        Restaurant: currentRestaurant,
        orderedItems: orderedItems, 
        Total: total, 
        Address: address, 
        Payment: payment,
        Promo: promo,
        DeliveryFee: deliveryFee,
        Final: final
    })
}

function addPromo() {
    code = request.body.code

    Request(Constants.serverURL + 'custPromo/' + code, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        let custPromojson = JSON.parse(body)[0]
        console.log(custPromojson)
        promo = custPromojson.amount
        console.log('here '+promo)
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
            let oid = JSON.parse(body)[0].orderid
            addFoodItems(oid)
            rewardUser()
            resetOrder()
            response.redirect(302, "/customer/home")
        }
    })

}

function addFoodItems(oid) {
    for (ord in orderedItems) {
        let foodname = orderedItems[ord].item
        let quantity = orderedItems[ord].quantity
        Request(Constants.serverURL + 'orderItems/' + restaurantId + '/' + foodname, 
            (error, res, body) => {
                let foodid = JSON.parse(body)[0].foodid
            
                //add Food Item
                let options = {
                    url: Constants.serverURL + 'orderItems/' + oid, 
                    form: {
                        foodid: foodid, 
                        quantity: quantity
                    }
                }
                Request.post(options, (error, res, body) => {
                    if (error) {
                        response.render("error", Errors.backendRequestError)
                    }
                })

                //update Food Item maxavailable
                options = {
                    url: Constants.serverURL + 'menu/quant/' + foodid,
                    form: {
                        quant: quantity,
                        restaurantId: restaurantId
                    }
                }
                Request.post(options, (error, res, body) => {
                    if (error) {
                        response.render("error", Errors.backendRequestError)
                    }
                })
        })

    }
}

function rewardUser() {
    let options = {
        url: Constants.serverURL + 'customers/reward/' + Shared.currentUserID, 
        form: {
            rewardpoints: 10
        }
    }

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
        }
    })
}

function resetOrder() {
    currentRestaurant = ""
    restaurantId = -1;
    orderedItems = []
    address = ""
    aid = -1;
    deliveryFee = -1;
    byCash = false;
    total = 0
    promo = 0
}

module.exports = { 
    selectRestaurant,
    selectItems,
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

