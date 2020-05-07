const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let currentItem = ""

let showRestaurantHome = (request, response) => {
    if (Shared.notLoggedIn()) {
        response.render("error", Errors.notLoggedIn)

    } else if (Shared.wrongUserType("restaurant")) {
        response.render("error", Errors.incorrectUserType)

    } else {

        let completion = (menulist) => {
            response.render("restaurant/restaurant-dashboard", {
                menu: menulist
            })
        }
        getMenuList(response, completion)
    }
}

function getMenuList(response, completion) {
    Request(Constants.serverURL + 'menu/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            console.log(error)
            response.render("error", Errors.backendRequestError)
            return
        }
        var menulist = JSON.parse(body);
        completion(menulist)
    })
}

let selectMenuItem = (request, response) => {
    Request(Constants.serverURL + 'menu/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
        }

        let menujson = JSON.parse(body)
        let menu = []

        for (item in menujson) {
            currentItem = menujson[item]
            menu.push(currentItem.foodname)
        }
        response.render("restaurant/editMenu", { Menu: menu });
    })
}

const createMenuItem = (request, response) => {
    let foodName = request.body.name
    let price = request.body.price
    let maxAvailable = request.body.avail
    let category = request.body.category
    let restaurantid = Shared.currentUserID

    let options = {
        url: Constants.serverURL + 'menu/' + Shared.currentUserID, 
        form: {
            restaurantid: restaurantid, 
            foodName: foodName, 
            price: price, 
            maxAvailable: maxAvailable,
            category: category
        }
    }

    Request.post(options, (error, res, body) => {

        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        if(res.statusCode == 500) {
            response.render("duplicateError",  {errorMessage: body })
        } else if (res.statusCode == 200) {
            response.redirect(302, "/restaurant/home")
        } else {
            response.render("error")
        }
    })
}

const editMenuItem = (request, response) => {
    let itemToEdit = request.body.dropDown //name
    let newFoodName = request.body.name
    let newPrice = request.body.price
    let newMaxAvailable = request.body.avail
    let newCategory = request.body.category
    let restaurantid = Shared.currentUserID

    let options = {
        url: Constants.serverURL + 'menu/' + itemToEdit, 
        form: {
            restaurantid: restaurantid, 
            newFoodName: newFoodName, 
            newPrice: newPrice, 
            newMaxAvailable: newMaxAvailable,
            newCategory: newCategory
        }
    }

    Request.put(options, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        if(res.statusCode == 500) {
            response.render("duplicateError",  {errorMessage: body })
        } else if (res.statusCode == 200) {
            response.redirect(302, "/restaurant/home")
        } else {
            response.render("error")
        }
    })
}

let showRestaurantSummary = (request, response) => {
    if (Shared.notLoggedIn()) {
        response.render("error", Errors.notLoggedIn)

    } else if (Shared.wrongUserType("restaurant")) {
        response.render("error", Errors.incorrectUserType)

    } else {

        let completion = (summarylist) => {
            response.render("restaurant/summary", {
                summary: summarylist
            })
        }
        getSummaryList(response, completion)
    }
}

function getSummaryList(response, completion) {
    Request.get(Constants.serverURL + 'restaurant/orders/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            console.log(error)
            response.render("error", Errors.backendRequestError)
            return
        }
        var summarylist = JSON.parse(body);
        completion(summarylist)
    })
}

let showPromoSummary = (request, response) => {
    if (Shared.notLoggedIn()) {
        response.render("error", Errors.notLoggedIn)

    } else if (Shared.wrongUserType("restaurant")) {
        response.render("error", Errors.incorrectUserType)

    } else {

        let completion = (promoSummary) => {
            response.render("restaurant/promoSummary", {
                summary: promoSummary
            })
        }
        getPromoSummaryList(response, completion)
    }
}

function getPromoSummaryList(response, completion) {
    Request.get(Constants.serverURL + 'restaurant/promoSummary/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            console.log(error)
            response.render("error", Errors.backendRequestError)
            return
        }
        var promoSummary = JSON.parse(body);
        completion(promoSummary)
    })
}

let showProfile = (request, response) => {
    if (Shared.notLoggedIn()) {
        response.render("error", Errors.notLoggedIn)

    } else if (Shared.wrongUserType("restaurant")) {
        response.render("error", Errors.incorrectUserType)

    } else {

        let completion = (reslist) => {
            response.render("restaurant/profile", {
                profile: reslist
            })
        }
        getProfile(response, completion)
    }
}

function getProfile(response, completion) {
    Request.get(Constants.serverURL + 'restaurants/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            console.log(error)
            response.render("error", Errors.backendRequestError)
            return
        }
        var reslist = JSON.parse(body);
        completion(reslist)
    })
}

const editProfile = (request, response) => {
    let itemToEdit = request.body.dropDown //mininmum order or delivery fee
    let newValue= request.body.newValue
    var options = {};
    
    if(itemToEdit == "minimum order") {
        options = {
            url: Constants.serverURL + 'restaurants/minorder/' + Shared.currentUserID, 
            form: {
                newMinOrder: newValue
            }
        }
    } else if (itemToEdit == "delivery fee") {

        options = {
            url: Constants.serverURL + 'restaurants/deliveryfee/' + Shared.currentUserID, 
            form: {
                newDeliveryFee: newValue
            }
        }
    } 

    Request.put(options, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        if(res.statusCode == 500) {
            console.log(body)
            response.render("error",  Errors.backendRequestError)
        } else if (res.statusCode == 200) {
            response.redirect(302, "/restaurant/profile")
        } else {
            response.render("error")
        }
    })
}

const createPromo = (request, response) => {
    let code = request.body.code
    let discount = request.body.discount
    let minSpend = request.body.minSpend
    let startDate = request.body.startDate
    let endDate = request.body.endDate
    let restaurantid = Shared.currentUserID

    let options = {
        url: Constants.serverURL + 'restPromo', 
        form: {
            restaurantid: restaurantid, 
            code: code, 
            amount: discount, 
            minSpend: minSpend,
            startDate: startDate,
            endDate: endDate
        }
    }

    Request.post(options, (error, res, body) => {

        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        if(res.statusCode == 500) {
            response.render("duplicateError",  {errorMessage: "promo code already exists! Try again?" })
        } else if (res.statusCode == 200) {
            response.redirect(302, "/restaurant/home")
        } else {
            response.render("error")
        }
    })
}

let showPromos = (request, response) => {
    if (Shared.notLoggedIn()) {
        response.render("error", Errors.notLoggedIn)

    } else if (Shared.wrongUserType("restaurant")) {
        response.render("error", Errors.incorrectUserType)

    } else {

        let completion = (promolist) => {
            response.render("restaurant/viewPromos", {
                summary: promolist
            })
        }
        getPromoList(response, completion)
    }
}

function getPromoList(response, completion) {
    Request.get(Constants.serverURL + 'restaurant/currentpromos/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            console.log(error)
            response.render("error", Errors.backendRequestError)
            return
        }
        var promolist = JSON.parse(body);
        completion(promolist)
    })
}

let showAddress = (request, response) => {
    
    let completion = (address) => {
        response.render("restaurant/viewAddress", {
            area: address.area,
            addresstext: address.addresstext,
            postalcode: address.postalcode
        })
    }

    getAddress(response, completion)
}

function getAddress(response, completion) {
    Request.get(Constants.serverURL + 'users/address/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            console.log(error)
            response.render("error", Errors.backendRequestError)
            return
        }

        let address = JSON.parse(body)[0]

        completion(address)
    })
}

let editAddress = (request, response) => {
    let { area, address, postalcode } = request.body

    let options = {
        url: Constants.serverURL + 'users/address/update', 
        form: {
            uid: Shared.currentUserID,
            area: area, 
            addresstext: address, 
            postalcode: postalcode
        }
    }

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
        }
        if (body == "success") {
            response.redirect(302, "/restaurant/home")
        } else {
            response.render("error", {
                errorMessage: body
            })
        }
    })
}

module.exports = {
    showRestaurantHome,
    createMenuItem,
    selectMenuItem,
    editMenuItem,
    showRestaurantSummary,
    showPromoSummary,
    showProfile,
    editProfile,
    createPromo,
    showPromos,
    showAddress,
    editAddress
}