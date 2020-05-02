const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

const createMenuItem = (request, response) => {
    let foodName = request.body.name
    let price = request.body.price
    let maxAvailable = request.body.avail
    let category = request.body.category
    let restaurantid = Shared.currentUserID

    let options = {
        url: Constants.serverURL + 'menu/' + Constants.currentUserID, 
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
    createMenuItem
}