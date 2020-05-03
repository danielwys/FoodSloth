const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let showManagerHome = (req, res) => {
    if (notLoggedIn()) {
        res.render("error", Errors.notLoggedIn)
    } else if (wrongUserType("rider")) {
        res.render("error", Errors.incorrectUserType)
    } else {
        res.render("manager/home")
    }
}

module.exports = {
    showManagerHome
}