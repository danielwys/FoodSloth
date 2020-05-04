DROP VIEW IF EXISTS CompletedOrders;

CREATE VIEW CompletedOrders(orderId, restaurantId, timeRiderDelivered, foodId, price) AS (
    WITH completedOrderID AS (
        SELECT orderId 
        FROM Orders O
        WHERE exists (
            select 1
            from OrderTimes OT
            where OT.orderId = O.orderId
            and OT.timeRiderDelivered IS NOT NULL
        )
    )
    SELECT O.orderId, O.restaurantId, OT.timeRiderDelivered, M.foodId, M.price 
    FROM Orders O natural join completedOrderID
        natural join OrderTimes OT
        natural join OrderItems OI
        natural join Menu M
);