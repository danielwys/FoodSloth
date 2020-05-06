// index.js

/**
 * Required External Modules
 */

const express = require("express");
const bodyParser = require('body-parser')

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8001";
const db = require('./queries')
/**
 *  App Configuration
 */

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
/**
 * Routes Definitions
 */

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

/**
 * Authentication
 */

app.post('/login', db.login) // returns uid
app.post('/register', db.register)

/** 
 * Users
 */
app.get('/users', db.getAllUsers)
app.get('/users/:uid', db.getUserById) // returns name, username and type
app.put('/users/:uid', db.updateUser)
app.get('/users/address/:uid', db.getAddress)
app.post('/users/address/update', db.updateAddress)

/**
 * Customers
 */
app.post('/customers/create', db.createCustomer)
app.get('/customers/:uid', db.getCustomerInfo) // returns reward points and credit card number
app.get('/customers/address/:uid', db.getCustomerAddress)
app.get('/customers/orders/:uid', db.getCustomerOrders)
app.post('/customers/:uid', db.updateCreditCard)
app.post('/customers/adress/add/:uid', db.customerAddAddress)
app.post('/customers/reward/:uid', db.updateCustomerReward)

/**
 * Restaurants
 */
app.get('/restaurants', db.getRestaurants)
app.post('/restaurants/create', db.createRestaurant)
app.get('/restaurants/:uid', db.getRestaurantInfo) //returns name, min order
app.put('/restaurants/minorder/:uid', db.updateRestaurantMinOrder)
app.put('/restaurants/deliveryfee/:uid', db.updateRestaurantDeliveryFee)
app.get('/restaurants/find/:restaurantname', db.findRestaurant)

/**
 * Riders
 */
app.post('/rider/create', db.createRider)
app.get('/rider/:uid', db.getRiderInfo)
app.get('/rider/orders/current/:uid', db.getRiderCurrentOrders)
app.get('/rider/orders/past/:uid', db.getRiderPastOrders)

app.get('/rider/mws/:uid', db.getFulltimeRiderHours)
app.post('/rider/mws/setday', db.setFulltimeRiderDay)
app.post('/rider/mws/setshift', db.setFulltimeRiderShift)

app.get('/rider/wws/:uid', db.getParttimeRiderHours)
app.post('/rider/wws/add', db.addParttimeSlot)
app.post('/rider/wws/delete', db.deleteParttimeSlot)


/**
 * Menu
 */
app.get('/menu/:uid', db.getMenuInfo) // returns foodname, price, category & maxavailability
app.get('/menu', db.getMenu)
app.get('/menu/show/:restaurantname', db.getMenuForRestaurant)
app.post('/menu/show/:restaurantname/check', db.checkItemAvail)
app.get('/menu/show/:restaurantname/:item', db.getItemInfo)
app.post('/menu/:uid', db.addMenuItem)
app.put('/menu/:foodName', db.updateMenuItem)
app.delete('/menu/:foodId', db.deleteMenuItem)

/**
 * Reviews
 */
app.get('/reviews/:uid', db.getReviews)
app.post('/reviews/:uid', db.addReview)

/**
 * Orders
 */
app.get('/orders', db.getOrders)
app.get('/order/:orderId', db.getOrder)
app.post('/order/new/:cid', db.createNewOrder) // returns orderId
app.put('/order/:orderId', db.updateOrderWithRiderInfo)

/**
 * Customer Promos
 */
app.get('/custPromo/:code', db.checkCustomerPromoEligibility)
app.post('/custPromo', db.addCustomerPromo)
app.put('/custPromo/:code', db.updateCustomerPromo)

/**
 * Restaurant Promos
 */
app.get('/restPromo/:code&:uid', db.checkRestaurantPromoEligibility)
app.get('/restaurant/currentpromos/:uid', db.getCurrentRestPromos)
app.post('/restPromo', db.addRestaurantPromo)
app.put('/restPromo/:code', db.updateRestaurantPromo)

/**
 * Order Items
 */
app.post('/orderItems/:orderId', db.addOrderItems)

/**
 * Order Timings
 */
app.get('/orderTimes/:orderId', db.getOrderTimes)
app.get('/orderTimes/riderArrives/:orderId', db.updateRiderArrives)
app.get('/orderTimes/riderCollects/:orderId', db.updateRiderCollects)
app.get('/orderTimes/riderDelivers/:orderId', db.updateRiderDelivers)

/**
 * Hours
 */
app.get('wwshours/:uid', db.getWWSRiderHours)
app.post('wwwhours/:uid', db.addWWSRiderHours)

app.get('mwshours/:uid', db.getMWSRiderHours)
app.post('mwshours/:uid', db.addMWSRiderHours)

/**
 * Statistics
 */
app.get('/manager/stats', db.getMonthlySummaryStatistic)

app.get('/manager/customerstats/:month', db.getCustomerStatistics)
app.get('/manager/areastats', db.getOrdersPerLocation)

app.get('rider/riderOrders', db.getRiderOrdersStatistic)
app.get('rider/hoursWorked', db.getRiderHoursWorked)
app.get('rider/salary', db.getRiderSalaries)
app.get('rider/avgDeliveryTime', db.getRiderAvgDeliveryTime)
app.get('rider/ratings', db.getRiderRatings)
app.get('rider/summary', db.getRiderSummary)

app.get('/restaurant/orders/:uid', db.getRestaurantOrderStatistic)
app.get('/restaurant/favourites/:month/:uid', db.getRestaurantOrderTopFive)
app.get('/restaurant/promoSummary/:uid', db.getRestaurantPromoSummary)

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

