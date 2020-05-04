DROP VIEW IF EXISTS RiderDashboardInfo;

CREATE VIEW RiderDashboardInfo(riderId, availability, salary, parttime, rating, commission) AS (

    WITH RiderEarnings AS (
        SELECT riderId, sum(deliveryfee) as commission
        FROM Orders
        GROUP BY riderId
    )

    SELECT R.riderid, R.availability, R.salary, R.parttime, R.rating, RE.commission
    FROM Riders R NATURAL LEFT JOIN RiderEarnings RE
);