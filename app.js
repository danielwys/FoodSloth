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

// Sign Up POST requests
app.post("/createCustomer", auth.createCustomer)

app.post("/createRider", auth.createRider)

app.post("/createRestaurant", auth.createRestaurant)

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

app.get("/customer/newOrder", orders.selectRestaurant)
app.post("/selectItems", orders.selectItems)
app.get("/customer/selectFoodItems", orders.selectItems)

app.get("/newOrder3", (req, res) => {
    res.render("user/newOrder3", {
        title: "Select Address",
        Restaurant: Restaurant,
        orderItems: orderedItems,
        address: Address,
    })
});
app.post("/payment", (req, res) => {
    deliveryAddress = req.body.dropDown3
    res.render("user/payment", {
        title: "Select Payment",
        Restaurant: Restaurant,
        orderItems: orderedItems,
        deliveryAddress: deliveryAddress,
    })
});
app.get("/editOrder", (req, res) => {
    res.render("user/editOrder", {
        Restaurant: Restaurant,
        orderItems: orderedItems,
    })
});
app.post("/editOrder", (req, res) => {
    var order = req.body.edits;
    orderedItems.pop(order);
    res.render("user/editOrder", {
        title: "Edit Order",
        Restaurant: Restaurant,
        orderItems: orderedItems,
    })
});

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

//summary

app.get("/restaurant/summary", restaurants.showRestaurantSummary)
app.get("/restaurant/favourites/5", (req, res) => {
    const month = 5
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


/**
 * Riders
 */
app.get("/rider/orders", riders.showRiderOrders)

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