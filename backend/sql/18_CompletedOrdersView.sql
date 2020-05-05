DROP VIEW IF EXISTS CompletedOrders;

CREATE VIEW CompletedOrders(month, cname, cid, orderId, restaurantId, timeRiderDelivered, foodId, price, foodName, area) AS (
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
    SELECT date_part('month', timeRiderDelivered) as month, C.cname, C.cid, O.orderId, O.restaurantId, OT.timeRiderDelivered, M.foodId, M.price, M.foodName, A.area
    FROM Orders O natural join completedOrderID
        natural join OrderTimes OT
        natural join OrderItems OI
        natural join Menu M
        inner join Customers C using (cid)
        inner join Addresses A using (aid)
);