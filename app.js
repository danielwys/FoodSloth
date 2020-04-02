var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var request = require('request');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var port = process.env.PORT || "8000";

var currentUserID
var currentUserType

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Routes Definitions
 */

 /**
  * Home page
  */
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

/**
 * 1. Authentication
 */

// Log In
app.get("/login", (req, res) => {
  res.render("user/login", {title: "Login", userProfile: {nickname: "Login"}});
});

app.post("/signinUser", (req, res) => {
  let username = req.body.username
  let password = req.body.password
  // console.log(email)
  // console.log(password)

  let options = {
    url: 'http://localhost:8001/login',
    form: {
      username: username,
      password: password
    }
  };
  request.post(options, (error, r, body) => {
    if (error) {
      console.log(error)
      res.render("error")
      return
    }

    if (body == "[]") {
      res.render("error");
    } else {
      res.render("user/userMain", { title: "Profile"});
    }
  });
});

 // Sign Up
app.get("/signup", (req, res) => {
  res.render("signup", { title: "SignUp"});
});

app.get("/signUpCustomer", (req, res) => {
  res.render("registration/signUpCustomer", { title: "Customer Sign Up"});
});

app.get("/signUpRider", (req, res) => {
  res.render("registration/signUpRider", { title: "Rider Sign Up"});
});

app.get("/signUpRestaurant", (req, res) => {
  res.render("registration/signUpRestaurant", { title: "Restaurant Sign Up"});
});

app.post("/createCustomer", (req, res) => {
  let name = req.body.name
  let username = req.body.username
  let password = req.body.password
  let creditCardNumber = req.body.creditCardNumber

  let createCustomer = (cid) => {
    let options = {
      url: 'http://localhost:8001/customers/create',
      form: {
        cid: cid,
        cname: name,
        creditCardNumber: creditCardNumber
      }
    }

    request.post(options, (error, response, body) => {
      if (error) {
        console.log(error)
        res.render("error")
      }
      if (body = "success") {
        res.render("user/login", {title: "Login", userProfile: {nickname: "Login"}});
      } else {
        res.render("error")
      }
      // can we get a completion page to show that the customer has successfully registered
      // and ask them to go to log in to login?
    })
  }

  createNewUser(username, password, "customer", createCustomer)
});

app.post("/createRider", (req, res) => {
  // do something
});

app.post("/createRestaurant", (req, res) => {
  let name = req.body.name
  let username = req.body.username
  let password = req.body.password
  let minOrder = req.body.creditCardNumber
  let deliveryFee = req.body.deliveryFee

  let createRestaurant = (rid) => {
    let options = {
      url: 'http://localhost:8001/restaurants/create',
      form: {
        restaurantid: rid,
        restaurantname: name,
        minorder : minOrder,
        deliveryfee: deliveryFee
      }
    }

    request.post(options, (error, response, body) => {
      if (error) {
        console.log(error)
        res.render("error")
      }
      if (body = "success") {
        res.render("user/login", {title: "Login", userProfile: {nickname: "Login"}});
      } else {
        res.render("error")
      }
      // can we get a completion page to show that the customer has successfully registered
      // and ask them to go to log in to login?
    })
  }

  createNewUser(username, password, "customer", createRestaurant)
});

function createNewUser(username, password, type, completion) {
  let options = {
    url: 'http://localhost:8001/register',
    form: {
      username: username,
      password: password,
      type: type
    }
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.log(error)
      res.render("error")
    }
    let result = JSON.parse(body)

    completion(result[0].uid)
  })
}

/**
 * Orders
 */

app.get("/neworder", (req, res) => {
  res.render("user/newOrder", { title: "Select Restaurant",
    Restaurants: ["Agnes Dining", "BaoBao", "Charlie and the Chocolate Factory", "Raymond and Associates"]
  })
});
var orderedItems = []
var Restaurant = ""
var Address = ["Thomson", "Clementi", "West Coast"]
var deliveryAddress= ""
app.post("/neworder2", (req, res) => {
  if (req.body.dropDown != null) {
    Restaurant = req.body.dropDown;
  } else {
    var Item = req.body.dropDown1;
    var Quantity = req.body.dropDown2;
    var newItem = {item: Item, quantity: Quantity};
    orderedItems.push(newItem);
  }
  res.render("user/newOrder2", { title: "Select Food",
    Restaurant: Restaurant,
    orderItems: orderedItems,
    Items: ['American Hotdog', 'Bagel', 'Cream cheese', 'Dalgona coffee'],
    Quantity: ['1', '2', '3', '4', '5']
  })
});
app.get("/neworder2", (req, res) => {
  res.render("user/newOrder2", { title: "Select Food",
    Restaurant: Restaurant,
    orderItems: orderedItems,
    Items: ['American Hotdog', 'Bagel', 'Cream cheese', 'Dalgona coffee'],
    Quantity: ['1', '2', '3', '4', '5']
  })
});
app.get("/newOrder3" , (req, res) => {
  res.render("user/newOrder3",{ title: "Select Address",
    Restaurant: Restaurant,
    orderItems: orderedItems,
    address: Address,
  })
});
app.post("/payment" , (req, res) => {
  deliveryAddress = req.body.dropDown3
  res.render("user/payment",{ title: "Select Payment",
    Restaurant: Restaurant,
    orderItems: orderedItems,
    deliveryAddress: deliveryAddress,
  })
});
app.get("/editOrder" , (req, res) => {
  res.render("user/editOrder",{
    Restaurant: Restaurant,
    orderItems: orderedItems,
  })
});
app.post("/editOrder", (req, res) => {
  var order = req.body.edits;
  orderedItems.pop(order);
  res.render("user/editOrder", { title: "Edit Order",
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
