const Request = require('request')

const Constants = require('./constants')
const Shared = require('./shared')
const Errors = require('./error.js')

let showRiderHome = (request, response) => {

    if (Shared.notLoggedIn()) {
        response.render("error", Errors.notLoggedIn)

    } else if (Shared.wrongUserType("rider")) {
        response.render("error", Errors.incorrectUserType)
        
    } else {
        let completion = (riderInfo) => {
            var type = riderInfo.parttime
            var rating = riderInfo.rating
            var salary = riderInfo.salary
            var commission = riderInfo.commission

            
            if (type) {
                type = "Part Time"
            } else {
                type = "Full Time"
            }

            if (rating === null) {
                rating = "No ratings yet."
            }

            if (commission === null) {
                commission = "No commission earned yet."
            }

            response.render("rider/home", {
                type: type,
                rating: rating,
                salary: salary,
                commission: commission
            })
        }
        getRiderInfo(response, completion)
    }
}

function getRiderInfo(response, completion) {
    Request(Constants.serverURL + 'rider/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let riderInfo = JSON.parse(body)[0]

        completion(riderInfo)

    })
}

let showRiderCurrentOrders = (request, response) => {
    let completion = (riderOrders) => {
        response.render("rider/currentOrders", {
            orders: riderOrders
        })
    }

    getRiderCurrentOrders(response, completion)
}

function getRiderCurrentOrders(response, completion) {
    Request(Constants.serverURL + 'rider/orders/current/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let riderOrders = JSON.parse(body)

        completion(riderOrders)
    })
}

let showRiderPastOrders = (request, response) => {
    let completion = (riderOrders) => {
        response.render("rider/pastOrders", {
            orders: riderOrders
        })
    }

    getRiderPastOrders(response, completion)
}

function getRiderPastOrders(response, completion) {
    Request(Constants.serverURL + 'rider/orders/past/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let riderOrders = JSON.parse(body)

        completion(riderOrders)
    })
}

let markArrived = (request, response) => {
    const orderId = parseInt(request.params.orderId)
    Request(Constants.serverURL + 'orderTimes/riderArrives/' + orderId, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        if (body == "success") {
            response.redirect(302, "/rider/orders/current")
        } else {
            response.render("error")
        }
        
    })
}

let markDeparted = (request, response) => {
    const orderId = parseInt(request.params.orderId)
    Request(Constants.serverURL + 'orderTimes/riderCollects/' + orderId, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        if (body == "success") {
            response.redirect(302, "/rider/orders/current")
        } else {
            response.render("error")
        }
        
    })
}

let markDelivered = (request, response) => {
    const orderId = parseInt(request.params.orderId)
    Request(Constants.serverURL + 'orderTimes/riderDelivers/' + orderId, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }
        if (body == "success") {
            response.redirect(302, "/rider/orders/current")
        } else {
            response.render("error")
        }
        
    })
}

let editFullTimeHours = (request, response) => {
    Request(Constants.serverURL + 'rider/mws/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let hours = JSON.parse(body)[0]
        
        let startday
        let shiftnum

        if (hours == null) {
            startday = 0
            shiftnum = 0
        } else {
            startday = hours.startday
            shiftnum = hours.shift
        }

        response.render("rider/mws", {
            startday: startday,
            shiftnum: shiftnum
        })
    })
}

let updateStartDay = (request, response) => {
    let day = request.body.day
    var startday = 0

    if (day === "Monday") {
        startday = 1
    } else if (day === "Tuesday") {
        startday = 2
    } else if (day === "Wednesday") {
        startday = 3
    } else if (day === "Thursday") {
        startday = 4
    } else if (day === "Friday") {
        startday = 5
    } else if (day === "Saturday") {
        startday = 6
    } else if (day === "Sunday") {
        startday = 0
    }

    let options = {
        url: Constants.serverURL + 'rider/mws/setday',
        form: {
            riderid: Shared.currentUserID,
            startday: startday
        }
    }

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error")
        }
        if (body == "success") {
            response.redirect(302, "/rider/mws")
        } else {
            response.render("error")
        }
    })
}

let updateShift = (request, response) => {
    let shift = request.body.shift
    var shiftno = 0

    if (shift === "10am to 2pm and 3pm to 7pm") {
        shiftno = 1
    } else if (shift === "11am to 3pm and 4pm to 8pm") {
        shiftno = 2
    } else if (shift === "12pm to 4pm and 5pm to 9pm") {
        shiftno = 3
    } else if (shift === "1pm to 5pm and 6pm to 10pm") {
        shiftno = 4
    } 

    let options = {
        url: Constants.serverURL + 'rider/mws/setshift',
        form: {
            riderid: Shared.currentUserID,
            shift: shiftno
        }
    }

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error")
        }
        if (body == "success") {
            response.redirect(302, "/rider/mws")
        } else {
            response.render("error")
        }
    })
}

let editPartTimeHours = (request, response) => {
    Request(Constants.serverURL + 'rider/wws/' + Shared.currentUserID, (error, res, body) => {
        if (error) {
            response.render("error", Errors.backendRequestError)
            return
        }

        let slots = JSON.parse(body)

        response.render("rider/wws", {
            slots: slots
        })

    })
}

let addSlot = (request, response) => {
    const { day, starthour, endhour } = request.body

    let dayno = ""

    if (day === "Monday") {
        dayno = 1
    } else if (day === "Tuesday") {
        dayno = 2
    } else if (day === "Wednesday") {
        dayno = 3
    } else if (day === "Thursday") {
        dayno = 4
    } else if (day === "Friday") {
        dayno = 5
    } else if (day === "Saturday") {
        dayno = 6
    } else if (day === "Sunday") {
        dayno = 0
    }

    let options = {
        url: Constants.serverURL + 'rider/wws/add',
        form: {
            riderid: Shared.currentUserID,
            day: dayno,
            hourstart: starthour,
            hourend: endhour
        }
    }

    console.log(dayno)
    console.log(starthour)
    console.log(endhour)

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error")
        }
        if (body == "success") {
            response.redirect(302, "/rider/wws")
        } else {
            response.render("error", {
                errorMessage: body
            })
        }
    })
}

let deleteSlot = (request, response) => {
    const day = parseInt(request.params.day)
    const hourstart = parseInt(request.params.start)
    const hourend = parseInt(request.params.end)

    let options = {
        url: Constants.serverURL + 'rider/wws/delete',
        form: {
            riderid: Shared.currentUserID,
            day: day,
            hourstart: hourstart,
            hourend: hourend
        }
    }

    Request.post(options, (error, res, body) => {
        if (error) {
            response.render("error")
        }
        if (body == "success") {
            response.redirect(302, "/rider/wws")
        } else {
            response.render("error", {
                errorMessage: body
            })
        }
    })

}

module.exports = {
    showRiderHome,
    showRiderCurrentOrders,
    showRiderPastOrders,
    markArrived,
    markDeparted,
    markDelivered,
    editFullTimeHours,
    editPartTimeHours,
    updateStartDay,
    updateShift,
    addSlot,
    deleteSlot
}