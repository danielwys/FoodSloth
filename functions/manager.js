const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let showManagerHome = (req, res) => {
    if (Shared.notLoggedIn()) {
        res.render("error", Errors.notLoggedIn)
    } else if (Shared.wrongUserType("manager")) {
        res.render("error", Errors.incorrectUserType)
    } else {
        res.render("manager/home")
    }
}

module.exports = {
    showManagerHome
}