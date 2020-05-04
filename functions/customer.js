const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let showCustomerHome = (req, res) => {
    if (Shared.notLoggedIn()) {
        res.render("error", Errors.notLoggedIn)
    } else if (Shared.wrongUserType("customer")) {
        res.render("error", Errors.incorrectUserType)
    } else {
        res.render("customer/home")
    }
}

module.exports = {
    showCustomerHome
}