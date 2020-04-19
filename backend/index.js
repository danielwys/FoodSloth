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

/**
 * Customers
 */
app.post('/customers/create', db.createCustomer)
app.get('/customers/:uid', db.getCustomerInfo) // returns reward points and credit card number
app.put('/customers/:id', db.updateCreditCard)

/**
 * Restaurants
 */
app.get('/restaurants', db.getRestaurants)
app.post('/restaurants/create', db.createRestaurant)
app.get('/restaurants/:uid', db.getRestaurantInfo) // returns minimum order
app.put('/restaurants/:uid', db.updateRestaurantMinOrder)

/**
 * Riders
 */
app.get('/rider/:uid', db.getRiderInfo) // returns rating, salary, type

/**
 * Menu
 */
app.get('/menu/:uid', db.getMenuInfo) // returns foodId, name, price, category & availability
app.post('/menu/:uid', db.addMenuItem)
app.put('/menu/:foodId', db.updateMenuItem)
app.delete('/menu/:foodId', db.deleteMenuItem)

/**
 * Reviews
 */
app.get('/reviews/:uid', db.getReviews)
app.post('/reviews/:uid', db.addReview)

/**
 * Orders
 */
app.get('/order/:orderId', db.getOrder)
app.post('/order', db.createNewOrder) // returns orderId
app.put('/order/:orderId', db.updateOrderWithRiderInfo)

/**
 * Customer Promos
 */
app.get('/custPromo/:code&:uid', db.checkCustomerPromoEligibility)
app.post('/custPromo', db.addCustomerPromo)
app.put('/custPromo/:code', db.updateCustomerPromo)

/**
 * Restaurant Promos
 */
app.get('/restPromo/:code&:uid', db.checkRestaurantPromoEligibility)
app.post('/restPromo', db.addRestaurantPromo)
app.put('/restPromo/:code', db.updateRestaurantPromo)

/**
 * Order Timings
 */
app.get('/orderTimes/:orderId', db.getOrderTimes)
app.put('/orderTimes/orderPlaced/:orderId', db.updateOrderPlaced)
app.put('/orderTimes/riderDeparts/:orderId', db.updateRiderDeparts)
app.put('/orderTimes/riderArrives/:orderId', db.updateRiderArrives)
app.put('/orderTimes/riderCollects/:orderId', db.updateRiderCollects)
app.put('/orderTimes/riderDelivers/:orderId', db.updateRiderDelivers)

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
app.get('stats/customer/newCustomers', db.getNewCustomerStatistic)

app.get('stats/order/newOrders', db.getNewOrderStatistic)
app.get('stats/order/totalCost', db.getTotalOrderCostStatistic)
app.get('stats/order/ordersPerCustomer', db.getOrdersPerCustomer)
app.get('stats/order/ordersPerLocation', db.getOrdersPerLocation)

app.get('rider/riderOrders', db.getRiderOrdersStatistic)
app.get('rider/hoursWorked', db.getRiderHoursWorked)
app.get('rider/salary', db.getRiderSalaries)
app.get('rider/avgDeliveryTime', db.getRiderAvgDeliveryTime)
app.get('rider/ratings', db.getRiderRatings)
app.get('rider/summary', db.getRiderSummary)

app.get('restaurant/orders/:id', db.getRestaurantOrderStatistic)

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

