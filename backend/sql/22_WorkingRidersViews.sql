DROP VIEW IF EXISTS WorkingRiders;

CREATE VIEW WorkingParttimeRiders AS (
    SELECT W.riderid FROM wws W
    WHERE (W.day = (SELECT EXTRACT(dow FROM now()))
    AND W.hourstart <= (SELECT EXTRACT(hour FROM now()))
    AND w.hourend > (SELECT EXTRACT(hour FROM now()))
    )
);

DROP VIEW IF EXISTS WorkingFulltimeRiders;

CREATE VIEW WorkingFulltimeRiders AS (
    SELECT M.riderid FROM mws M 
    WHERE ( 
    (
        (M.startday % 7) = (SELECT EXTRACT(dow FROM now()))  
        OR ( (M.startday + 1) % 7 = (SELECT EXTRACT(dow FROM now())) )
        OR ( (M.startday + 2) % 7 = (SELECT EXTRACT(dow FROM now())) )
        OR ( (M.startday + 3) % 7 = (SELECT EXTRACT(dow FROM now())) )
        OR ( (M.startday + 4) % 7 = (SELECT EXTRACT(dow FROM now())) )
    )
    AND (
        (shift = 1 AND (SELECT EXTRACT(hour FROM now()) >= 10) AND (SELECT EXTRACT(hour FROM now()) < 14))
        OR (shift = 1 AND (SELECT EXTRACT(hour FROM now()) >= 15) AND (SELECT EXTRACT(hour FROM now()) < 19))
        OR (shift = 2 AND (SELECT EXTRACT(hour FROM now()) >= 11) AND (SELECT EXTRACT(hour FROM now()) < 15))
        OR (shift = 2 AND (SELECT EXTRACT(hour FROM now()) >= 16) AND (SELECT EXTRACT(hour FROM now()) < 20))
        OR (shift = 3 AND (SELECT EXTRACT(hour FROM now()) >= 12) AND (SELECT EXTRACT(hour FROM now()) < 16))
        OR (shift = 3 AND (SELECT EXTRACT(hour FROM now()) >= 17) AND (SELECT EXTRACT(hour FROM now()) < 21))
        OR (shift = 4 AND (SELECT EXTRACT(hour FROM now()) >= 13) AND (SELECT EXTRACT(hour FROM now()) < 17))
        OR (shift = 5 AND (SELECT EXTRACT(hour FROM now()) >= 18) AND (SELECT EXTRACT(hour FROM now()) < 22))
    )
    )
);

DROP VIEW IF EXISTS RiderOrderCount;

CREATE VIEW RiderOrderCount AS (
    SELECT riderid, count(*) AS currentorders
    FROM RiderOrders
    WHERE status <> 'complete'
    GROUP BY riderid
);

DROP VIEW IF EXISTS WorkingRiders;

CREATE VIEW WorkingRiders AS (
WITH AllWorkingRiders AS (
    SELECT riderid
    FROM WorkingParttimeRiders 
    UNION ALL
    SELECT riderid
    FROM WorkingFulltimeRiders
)

SELECT A.riderid, CASE
    WHEN R.currentorders IS NULL THEN 0
    ELSE R.currentorders
END AS currentorders
FROM AllWorkingRiders A LEFT JOIN RiderOrderCount R
ON A.riderid = R.riderid
);