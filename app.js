var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');

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
let auth = require('./functions/auth/auth')

/**
 * Routes Definitions
 */

/**
 * Home page
 */
app.get("/", (req, res) => {
    res.render("index", Constants.homeTitle);
});

/**
 * 1. Authentication
 */

// Auth
app.get("/customer/login", auth.showLogin);
app.post("/signIn", auth.signInCustomer)

// Sign Up
app.get("/signup", (req, res) => {
    res.render("signup", Constants.signupTitle);
});

app.get("/signUpCustomer", (req, res) => {
    res.render("registration/signUpCustomer", Constants.signupTitle);
});

app.get("/signUpRestaurant", (req, res) => {
    res.render("registration/signUpRestaurant", Constants.restaurantSignupTitle)
});

app.get("/signUpRider", (req, res) => {
    res.render("registration/signUpRider", Constants.riderSignupTitle);
});

app.post("/createCustomer", auth.createCustomer)

app.post("/createRider", auth.createRider)

app.post("/createRestaurant", auth.createRestaurant)

/**
 * Customer Home
 */

app.get("/customer/home", (req, res) => {
    if (Shared.currentUserID === "" && Shared.currentUserType === "") {
        res.redirect(302, "login")
    } else {
        console.log(Shared.currentUserID)
        console.log(Shared.currentUserType)
        res.render("customer/home")
    }
})

/**
 * Orders
 */

app.get("/customer/neworder", (req, res) => {
    request('http://localhost:8001/restaurants', (error, resp, body) => {
        if (error) {
            console.log(erorr)
            res.render("error")
        }
        let restaurantsjs = JSON.parse(body)
        let restArray = []

        for (rest in restaurantsjs) {
            curRest = restaurantsjs[rest]
            restArray.push(curRest.restaurantname)
        }
        res.render("customer/selectRestaurant", { title: "Select Restaurant", Restaurants: restArray })
    })
});

var orderedItems = []
var Restaurant = ""
var Address = ["Thomson", "Clementi", "West Coast"]
var deliveryAddress = ""

app.post("/neworder2", (req, res) => {
    if (req.body.dropDown != null) {
        Restaurant = req.body.dropDown;
    } else {
        var Item = req.body.dropDown1;
        var Quantity = req.body.dropDown2;
        var newItem = { item: Item, quantity: Quantity };
        orderedItems.push(newItem);
    }
    res.render("user/newOrder2", {
        title: "Select Food",
        Restaurant: Restaurant,
        orderItems: orderedItems,
        Items: ['American Hotdog', 'Bagel', 'Cream cheese', 'Dalgona coffee'],
        Quantity: ['1', '2', '3', '4', '5']
    })
});
app.get("/neworder2", (req, res) => {
    res.render("user/newOrder2", {
        title: "Select Food",
        Restaurant: Restaurant,
        orderItems: orderedItems,
        Items: ['American Hotdog', 'Bagel', 'Cream cheese', 'Dalgona coffee'],
        Quantity: ['1', '2', '3', '4', '5']
    })
});
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

app.get("/signinRider", (req, res) => {
    res.render("rider/riderMain", { title: "Profile", userProfile: { nickname: "Auth0" } });
});
app.get("/rider", (req, res) => {
    res.render("rider/rider", { title: "Rider", userProfile: { nickname: "Rider0" } });
});

app.get("/restaurant", (req, res) => {
    res.render("restaurant", { title: "Restaurant", userProfile: { nickname: "Restaurant0" } });
});
app.get("/manager", (req, res) => {
    res.render("manager", { title: "Manager", userProfile: { nickname: "Manager0" } });
});
app.get("/signup", (req, res) => {
    res.render("signup", { title: "Manager", userProfile: { nickname: "Manager0" } });
});

// restaurant dashboard part
app.get("/restaurant-dashboard", (req, res) => {
    var jsonlist = [{ Mc: "spicy", bada: "bing", Lee: "Kuan Yew" }, { Mc: "doner", bada: "boom", Lee: "Hsien Loong" }];
    var titles = Object.keys(jsonlist[0]);
    res.render("restaurant-dashboard", { title: "Restaurant", data_list: jsonlist, headers: titles })
});
app.get("/create-menu", (req, res) => {
    res.render("create-menu", { title: "Menu", userProfile: { nickname: "Restaurant0" } });
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
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
