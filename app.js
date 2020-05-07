var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Request = require('request');

var app = express();
var port = process.env.PORT || "8000";

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

let Constants = require('./functions/constants')
let Shared = require('./functions/shared')
let Errors = require('./functions/error')

let auth = require('./functions/auth')
let orders = require('./functions/orders')
let customers = require('./functions/customer')
let restaurants = require('./functions/restaurants')
let riders = require('./functions/riders')
let managers = require('./functions/manager')

/**
 * Routes Definitions
 */

/**
 * Home page: COMPLETE
 */
app.get("/", (req, res) => {
    res.render("index");
});

/**
 * 1. Authentication: COMPLETE
 */

// Log in
app.get("/customer/login", auth.showCustomerLogin)
app.post("/signin/customer", auth.signInCustomer)

app.get("/rider/login", auth.showRiderLogin)
app.post("/signin/rider", auth.signInRider)

app.get("/restaurant/login", auth.showRestaurantLogin)
app.post("/signin/restaurant", auth.signInRestaurant)

app.get("/manager/login", auth.showManagerLogin)
app.post("/signin/manager", auth.signInManager)

// Sign Up
app.get("/signup", (req, res) => {
    res.render("signup", Constants.signupTitle);
})

app.get("/signup/customer", (req, res) => {
    res.render("customer/signup");
})

app.get("/signup/rider", (req, res) => {
    res.render("rider/signup");
})

app.get("/signup/restaurant", (req, res) => {
    res.render("restaurant/signup")
})

app.get("/signup/manager", (req, res) => {
    res.render("manager/signup")
})

// Sign Up POST requests
app.post("/createCustomer", auth.createCustomer)

app.post("/createRider", auth.createRider)

app.post("/createRestaurant", auth.createRestaurant)

app.post("/createManager", auth.createManager)

// Logout
app.get("/logout", (req, res) => {
    Shared.currentUserID = ""
    Shared.currentUserType = ""
    res.redirect(302, "/")
})

/**
 * Home page: Restaurants & Manager to complete
 */

app.get("/customer/home", customers.showCustomerHome)

app.get("/rider/home", riders.showRiderHome)

app.get("/restaurant/home", restaurants.showRestaurantHome)

app.get("/manager/home", managers.showManagerHome)

/**
 * Orders
 */

 //select restaurant
app.get("/customer/newOrder", orders.selectRestaurant)

//select food items
app.post("/selectItems", orders.selectItems)
app.get("/customer/selectFoodItems", orders.selectItems)

//select address
app.get("/customer/selectAddress", orders.selectAddress)
app.get("/customer/addAddress", orders.openAddAddress)
app.post("/addAddress", orders.addAddress)

//edit order
app.get("/editOrder", orders.editOrder)
app.post("/editOrder", orders.deleteItem)

app.get("/customer/selectPayment", orders.selectPayment)
app.post("/selectPayment", orders.selectPayment)
app.get("/customer/updateCreditcardnumber", orders.openUpdateCreditcardnumber)
app.post("/updateCreditcardnumber", orders.updateCreditcardnumber)

//finalise order
app.post("/confirmOrder", orders.finaliseOrder)
app.post("/addPromo", orders.addPromo)

app.get("/createOrder", orders.createOrder)
app.post("/createOrder", orders.createOrder)

/**
 * Customers
 */
app.get("/customer/profile", customers.getProfile)
app.get("/customer/pastorders", customers.getPastOrders)
app.get("/customer/review/:oid", (req, res) => {
    const oid = parseInt(req.params.oid);
    res.render("customer/createReview", { oid: JSON.stringify(oid) })
})
app.post("/createReview", customers.createReview)

/**
 * Restaurants
 */
//adding item
app.get("/restaurant/addMenu", (req, res) => {
    res.render("restaurant/addMenu")
})
app.post("/createMenu", restaurants.createMenuItem)

//editing item
app.get("/restaurant/editMenu", restaurants.selectMenuItem)
app.post("/editItem", restaurants.editMenuItem)

//promo
app.get("/restaurant/launchPromo", (req, res) => {
    res.render("restaurant/launchPromo")
})
app.post("/createPromo", restaurants.createPromo)
app.get("/restaurant/viewPromos", restaurants.showPromos)
//summary

app.get("/restaurant/summary", restaurants.showRestaurantSummary)
app.get("/restaurant/favourites/:month", (req, res) => {
    const month = parseInt(req.params.month);
    Request(Constants.serverURL + 'restaurant/favourites/' + month + "/" + Shared.currentUserID , (error, response, body) => {
        if (error) {
            console.log(error)
            res.render("error", Errors.backendRequestError)
            return
        }
        var favlist = JSON.parse(body);
        res.render("restaurant/favourites", {
            favourites: favlist
          });
    })
    
})
app.get("/restaurant/promoSummary", restaurants.showPromoSummary)

//profile
app.get("/restaurant/profile", restaurants.showProfile)
app.post("/restaurant/editProfile", restaurants.editProfile)
app.get("/restaurant/address", restaurants.showAddress)
app.post("/restaurant/editAddress", restaurants.editAddress)

/**
 * Riders
 */
app.get("/rider/orders/current", riders.showRiderCurrentOrders)
app.get("/rider/orders/past", riders.showRiderPastOrders)

app.get("/rider/orders/arrived/:orderId", riders.markArrived)
app.get("/rider/orders/departed/:orderId", riders.markDeparted)
app.get("/rider/orders/delivered/:orderId", riders.markDelivered)

app.get("/rider/wws", riders.editPartTimeHours)
app.get("/rider/mws", riders.editFullTimeHours)

app.post("/rider/mws/updateStartDay", riders.updateStartDay)
app.post("/rider/mws/updateShift", riders.updateShift)

app.post("/rider/wws/addSlot", riders.addSlot)
app.get("/rider/wws/deleteSlot/:day/:start/:end", riders.deleteSlot)

/**
 * Managers
 */
app.get("/manager/customerstats/:month", (req, res) => {
    const month = parseInt(req.params.month);
    Request(Constants.serverURL + 'manager/customerstats/' + month, (error, response, body) => {
        if (error) {
            console.log(error)
            res.render("error", Errors.backendRequestError)
            return
        }
        let customerlist = JSON.parse(body);
        res.render("manager/customerSummary", {
            summary: customerlist
          });
    })
    
})

app.get("/manager/areastats", managers.showAreaStats)


// template
app.get("/data", (req, res) => {
    // template for get requests, assuming the json is in this form
    // assumes each json item has same key names
    var jsonlist = [{ Mc: "spicy", bada: "bing", Lee: "Kuan Yew" }, { Mc: "Im hungry maybe I should rly foodsloth some mcspicy", bada: "boom", Lee: "Hsien Loong" }];
    var titles = Object.keys(jsonlist[0]);
    res.render("data", { title: "Data", data_list: jsonlist, headers: titles })
})

/**
 * Server Activation
 */
app.listen(port, (error) => {
    if(error) {
        console.log('Something went wrong', error)
    } else {
        console.log(`Listening to requests on http://localhost:${port}`);
    }
});