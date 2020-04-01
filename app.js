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
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/signup", (req, res) => {
  res.render("signup", { title: "SignUp"});
});
app.get("/createCus", (req, res) => {
  res.render("registration/createcus", { title: "Customer"});
});
app.get("/createRider", (req, res) => {
  res.render("registration/createrider", { title: "Rider"});
});
app.get("/createRestaurant", (req, res) => {
  res.render("registration/createrestaurant", { title: "Restaurant"});
});
app.get("/createManager", (req, res) => {
  res.render("registration/createmanager", { title: "Manager", userProfile: { nickname: "Manager0" } });
});

app.get("/user", (req, res) => {
  var nick = ""
  request("http://localhost:8001/users/1", { json: true }, (err, r, data) => {
    if (err) { 
        return console.log(err); 
    }
    let nick = data[0].username
    res.render("user/user", { title: "Profile", userProfile: { nickname: nick } });
  });
});

app.get("/signinUser", (req, res) => {
  res.render("user/userMain", { title: "Profile", userProfile: { nickname: "Auth0" } });
});
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
// restaurant part
app.get("/restaurant-dashboard", (req, res) => {
  var jsonlist = [{ Mc: "spicy", bada: "bing", Lee: "Kuan Yew" }, { Mc: "Im hungry maybe I should rly foodsloth some mcspicy", bada: "boom", Lee: "Hsien Loong" }];
  var titles = Object.keys(jsonlist[0]);
  res.render("restaurant-dashboard", { title: "Restaurant", data_list: jsonlist, headers: titles })
});
app.get("/create-menu", (req, res) => {
  res.render("create-menu", { title: "Menu", userProfile: { nickname: "Restaurant0" } });
});
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
