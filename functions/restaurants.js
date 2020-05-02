const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let currentItem = ""


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
        if (body = "success") {
            response.redirect(302, "/restaurant/home")
        } else {
            response.render("error")
        }
    })
}

const editMenuItem = (request, response) => {
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
        if (body = "success") {
            response.redirect(302, "/restaurant/home")
        } else {
            response.render("error")
        }
    })
}

module.exports = {
    createMenuItem,
    selectMenuItem,
    editMenuItem
}