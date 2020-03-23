var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
//});
router.get("/user", (req, res, next) => {
  res.send("../user/user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});
router.get("/signinUser", (req, res, next) => {
  res.send("../user/userMain", { title: "Profile", userProfile: { nickname: "Auth0" } });
});

module.exports = router;
