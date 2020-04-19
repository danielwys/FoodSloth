var express = require('express')
var router = express.Router()

/**
 * 1. Authentication
 */

// Log In
router.get("/login", (req, res) => {
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
   router.get("/signup", (req, res) => {
    res.render("signup", { title: "SignUp"});
  });
  
  router.get("/signUpCustomer", (req, res) => {
    res.render("registration/signUpCustomer", { title: "Customer Sign Up"});
  });
  
  router.get("/signUpRider", (req, res) => {
    res.render("registration/signUpRider", { title: "Rider Sign Up"});
  });
  
  router.get("/signUpRestaurant", (req, res) => {
    res.render("registration/signUpRestaurant", { title: "Restaurant Sign Up"});
  });
  
  router.post("/createCustomer", (req, res) => {
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
  
  router.post("/createRider", (req, res) => {
    // do something
  });
  
  router.post("/createRestaurant", (req, res) => {
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
  