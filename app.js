var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

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
  res.render("user/user", { title: "Profile", userProfile: { nickname: "Auth0" } });
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
app.post("/newOrder3" , (req, res) => {
  res.render("newOrder3",{
      items: orderedItems
  })
});
app.get("")

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
