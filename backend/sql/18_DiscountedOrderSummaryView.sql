DROP VIEW IF EXISTS DiscountedOrders;

CREATE VIEW DiscountedOrders AS (
    WITH noDiscountStats as (
        select C.month, C.orderId, C.restaurantId,
            SUM(C.price * C.quantity) as cost, 
            coalesce(
                (select amount 
                from Promos P 
                where C.promoCode = P.code), 
            0) as discount
        from completedOrders C
        group by C.month, C.orderid, C.promoCode, C.restaurantid         
    )
    select month, orderid, restaurantid, SUM((CAST(cost AS NUMERIC(10,2)) - CAST(discount AS NUMERIC(10,2)))) as cost
    from noDiscountStats
    group by month, orderid, restaurantid
    order by month DESC
);