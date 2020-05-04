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
            response.render("menuError",  {errorMessage: body })
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
            response.render("menuError",  {errorMessage: body })
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

module.exports = {
    showRestaurantHome,
    createMenuItem,
    selectMenuItem,
    editMenuItem,
    showRestaurantSummary,
}