DROP VIEW IF EXISTS RiderOrdersByMonth;

CREATE VIEW RiderOrdersByMonth AS (
    SELECT O.riderid, (SELECT EXTRACT (month FROM T.timeordered)) AS month, count(*) as orders
    FROM Orders O NATURAL JOIN OrderTimes T
    GROUP BY (O.riderid, month)
);

DROP VIEW IF EXISTS RiderHoursWorked;

CREATE VIEW RiderHoursWorked AS (
    WITH FulltimeRiderHours AS (
        SELECT riderid, 40 as hours
        FROM riders
        WHERE parttime = FALSE
    ), ParttimeRiderShifts AS (
        SELECT R.riderid, W.hourstart, W.hourend
        FROM Riders R NATURAL JOIN WWS W
        WHERE R.parttime = true
    ), ParttimeRiderHours AS (
        SELECT riderid, SUM(hourend - hourstart) as hours
        FROM ParttimeRiderShifts
        GROUP BY riderid
    ), RidersWithNoHours AS (
        SELECT riderid FROM riders
        EXCEPT (SELECT riderid FROM FulltimeRiderHours)
        EXCEPT (SELECT riderid FROM ParttimeRiderHours)
    )
    SELECT * FROM FulltimeRiderHours
    UNION
    SELECT * FROM ParttimeRiderHours
    UNION
    SELECT riderid, 0 AS hours FROM RidersWithNoHours

);

DROP VIEW IF EXISTS RiderTotalEarnings;

CREATE VIEW RiderTotalEarnings AS (
    WITH RiderEarnings AS (
        SELECT O.riderId, (SELECT EXTRACT (month FROM T.timeordered)) AS month, sum(O.deliveryfee) as commission
        FROM Orders O NATURAL JOIN OrderTimes T
        GROUP BY (O.riderId, month)
    ), RiderEarningsWithSalary AS (
        SELECT E.riderID, E.month, E.commission, R.salary
        FROM RiderEarnings E, Riders R
        WHERE E.riderid = R.riderid
    )

    SELECT riderid, month, sum(commission + salary)
    FROM RiderEarningsWithSalary
    GROUP BY (riderid, month)
);

DROP VIEW IF EXISTS AverageDeliveryTime;

CREATE VIEW AverageDeliveryTime AS (
    SELECT riderid, (SELECT EXTRACT (month FROM timeriderassigned)) as month, AVG(timeriderdelivered - timeriderassigned) as time
    FROM Orders
    NATURAL JOIN OrderTimes
    GROUP BY riderid, month
);

DROP VIEW IF EXISTS RiderRatingSummary;

CREATE VIEW RiderRatingSummary AS (
    WITH RiderOrderRating as (
        SELECT riderid, rating, (SELECT extract(month FROM createdat)) AS month
        FROM Orders NATURAL JOIN Reviews
    )
    SELECT riderid, month, count(rating) as reviewcount, avg(rating) as reviewavg
    FROM RiderOrderRating
    GROUP BY (riderid, month)
);

DROP VIEW IF EXISTS RiderStatistics;

CREATE VIEW RiderStatistics AS (
    SELECT * FROM Riders 
    NATURAL LEFT JOIN RiderOrdersByMonth 
    NATURAL LEFT JOIN RiderHoursWorked 
    NATURAL LEFT JOIN RiderTotalEarnings 
    NATURAL LEFT JOIN AverageDeliveryTime 
    NATURAL LEFT JOIN RiderRatingSummary 
    ORDER BY riderid
);