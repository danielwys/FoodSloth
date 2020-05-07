DROP VIEW IF EXISTS AreaSummary;

CREATE VIEW AreaSummary(hour,northCount, southCount, eastCount, westCount, centralCount) AS (
    WITH northTable AS (
        SELECT count(distinct orderId) as northCount, date_part('hour', timeRiderDelivered) as hour
        FROM CompletedOrders
        WHERE area = 'north'
        group by hour
    ), southTable AS (
        SELECT count(distinct orderId) as southCount, date_part('hour', timeRiderDelivered) as hour
        FROM CompletedOrders
        WHERE area = 'south'
        group by hour
    ), eastTable AS (
        SELECT count(distinct orderId) as eastCount, date_part('hour', timeRiderDelivered) as hour
        FROM CompletedOrders
        WHERE area = 'east'
        group by hour
    ), westTable AS (
        SELECT count(distinct orderId) as westCount, date_part('hour', timeRiderDelivered) as hour
        FROM CompletedOrders
        WHERE area = 'west'
        group by hour
    ), centralTable AS (
        SELECT count(distinct orderId) as centralCount, date_part('hour', timeRiderDelivered) as hour
        FROM CompletedOrders
        WHERE area = 'central'
        group by hour
    )
    SELECT hour, coalesce(N.northCount,0),coalesce(S.southCount,0), coalesce(E.eastCount,0), coalesce(W.westCount,0), coalesce(C.centralCount,0)
    FROM northTable N full outer join southTable S using (hour)
        full outer join eastTable E using (hour)
        full outer join westTable W using (hour)
        full outer join centralTable C using (hour)
);