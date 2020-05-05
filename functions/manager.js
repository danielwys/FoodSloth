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
        let completion = (summarylist) => {
            res.render("manager/home", {
                summary: summarylist
            })
        }
        getMainSummaryList(res, completion)    
    }
}

function getMainSummaryList(response, completion) {
    Request(Constants.serverURL + 'manager/stats', (error, res, body) => {
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
    showManagerHome
}