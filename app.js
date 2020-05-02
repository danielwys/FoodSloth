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

/**
 * Routes Definitions
 */

/**
 * Home page
 */
app.get("/", (req, res) => {
    res.render("index");
});

/**
 * 1. Authentication
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
 * Home page
 */

app.get("/customer/home", (req, res) => {
    if (notLoggedIn()) {
        res.render("error", Errors.notLoggedIn)
    } else if (wrongUserType("customer")) {
        res.render("error", Errors.incorrectUserType)
    } else {
        res.render("customer/home")
    }
})

app.get("/rider/home", (req, res) => {
    if (notLoggedIn()) {
        res.render("error", Errors.notLoggedIn)
    } else if (wrongUserType("rider")) {
        res.render("error", Errors.incorrectUserType)
    } else {
        res.render("rider/riderMain")
    }
})

app.get("/restaurant/home", (req, res) => {
    if (notLoggedIn()) {
        res.render("error", Errors.notLoggedIn)
    } else if (wrongUserType("restaurant")) {
        res.render("error", Errors.incorrectUserType)
    } else {
        //previous implementation that used utils in dashboard
        //var jsonlist = [{ Mc: "spicy", bada: "bing", Lee: "Kuan Yew" }, { Mc: "doner", bada: "boom", Lee: "Hsien Loong" }];
        //var titles = Object.keys(jsonlist[0]);
        //res.render("restaurant/restaurant-dashboard", { title: "Restaurant", data_list: jsonlist, headers: titles })
        Request(Constants.serverURL + 'menu/' + Shared.currentUserID, (error, response, body) => {
            if (error) {
                console.log(error)
                res.render("error", Errors.backendRequestError)
            }
            var menulist = JSON.parse(body);
            res.render("restaurant/restaurant-dashboard", {
                menu: menulist
              });
        })
    }
})





app.get("/manager/home", (req, res) => {
    if (notLoggedIn()) {
        res.render("error", Errors.notLoggedIn)
    } else if (wrongUserType('manager')) {
        res.render("error", Errors.incorrectUserType)
    } else {
        res.render("manager/home")
    }
})

function notLoggedIn() {
    return (Shared.currentUserID === "" && Shared.currentUserType === "")
}

function wrongUserType(expectedType) {
    return !(Shared.currentUserType == expectedType)
}

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


app.get("/restaurant/create-menu", (req, res) => {
    res.render("restaurant/create-menu", { title: "Menu", userProfile: { nickname: "Restaurant0" } });
});
var menuItemList = [];
app.post("/create-menu", (req, res) => {
    var foodItem = req.body.food;
    var price = req.body.price;
    var avail = req.body.avail;
    var limit = req.body.limit;
    var category = req.body.cat;
    var menuItemJson = { food_item: foodItem, food_price: price, food_avail: avail, food_limit: limit, food_cat: category }
    menuItemList.push(menuItemJson)
    console.log(menuItemList)
    res.render("create-menu", { title: "Menu", userProfile: { nickname: "Restaurant0" } });
});

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
