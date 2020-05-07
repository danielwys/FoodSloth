DROP VIEW IF EXISTS OrderStatus;

CREATE VIEW OrderStatus(orderId, status) AS (

    SELECT orderId, CASE 
        WHEN timeriderassigned IS NULL THEN 'assign'
        WHEN timeriderarrives IS NULL THEN 'arrive'
        WHEN timeriderdeparted IS NULL THEN 'depart'
        WHEN timeriderdelivered IS NULL THEN 'deliver'
        ELSE 'complete'
    END AS status
    from OrderTimes
)