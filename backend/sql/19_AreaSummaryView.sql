DROP VIEW IF EXISTS AreaSummary;

CREATE VIEW AreaSummary(hour,) AS (
    WITH northTable AS (
        SELECT count(distinct orderId) as northCount, date_part('hour', timeRiderDelivered) as hour
        FROM CompletedOrders
        WHERE area = 'north'
        group by hour
    )
    SELECT date_part('month', timeRiderDelivered) as month, C.cname, C.cid, O.orderId, O.restaurantId, OT.timeRiderDelivered, M.foodId, M.price, M.foodName, A.area
    FROM Orders O natural join completedOrderID
        natural join OrderTimes OT
        natural join OrderItems OI
        natural join Menu M
        inner join Customers C using (cid)
        inner join Addresses A using (aid)
);