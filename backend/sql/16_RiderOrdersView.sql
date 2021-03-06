DROP VIEW IF EXISTS RiderOrders;

CREATE VIEW RiderOrders(riderId, orderId, restName, restAddr, restPostal, custName, custAddr, custPostal, deliveryFee) AS (
    
    WITH RiderOrderInfo AS (
        SELECT riderId, orderId, restaurantId, cid as customerId, deliveryFee
        FROM Orders
    ), WithRestaurantName AS (
        SELECT O.riderId, O.orderId, R.restaurantId, R.restaurantName as restName, O.customerId, O.deliveryFee
        FROM RiderOrderInfo O LEFT JOIN Restaurants R 
        ON O.restaurantId = R.restaurantId
    ), WithRestaurantAddress AS (
        SELECT O.riderId, O.orderId, O.restName, R.addressText as restAddr, R.postalcode as restPostal, O.customerId, O.deliveryFee
        FROM WithRestaurantName O LEFT JOIN Addresses R 
        ON O.restaurantId = R.uid
    ), WithCustomerName AS (
        SELECT O.riderId, O.orderId, O.restName, O.restAddr, O.restPostal, O.customerId, R.cname as custName, O.deliveryFee
        FROM WithRestaurantAddress O LEFT JOIN Customers R
        ON O.customerId = R.cid
    ), WithCustomerAddress AS (
        SELECT O.riderId, O.orderId, O.restName, O.restAddr, O.restPostal, O.custName, R.addressText as custAddr, R.postalcode as custPostal, O.deliveryFee
        FROM WithCustomerName O LEFT JOIN Addresses R
        ON O.customerId = R.uid
    ), WithStatus AS (
        SELECT O.riderId, O.orderId, O.restName, O.restAddr, O.restPostal, O.custName, O.custAddr, O.custPostal, O.deliveryFee, R.status 
        FROM WithCustomerAddress O LEFT JOIN OrderStatus R
        ON O.orderId = R.orderId
    )

    SELECT * from WithStatus
);