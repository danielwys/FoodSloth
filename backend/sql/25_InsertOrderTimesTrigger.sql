CREATE OR REPLACE FUNCTION insert_ordertimes() RETURNS TRIGGER AS $$

DECLARE
    rider   integer;

BEGIN
    SELECT O.riderid INTO rider
    FROM Orders O
    WHERE O.orderid = NEW.orderid;

    INSERT INTO OrderTimes(orderid) 
    VALUES (NEW.orderid);

    IF rider IS NOT NULL THEN
        UPDATE OrderTimes O SET timeriderassigned = now()
        WHERE O.orderid = NEW.orderid;

    END IF;

    RETURN NULL;

END;

$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS insert_ordertimes_trigger ON Orders CASCADE;
CREATE TRIGGER insert_ordertimes_trigger
    AFTER INSERT ON Orders
    FOR EACH ROW 
    EXECUTE FUNCTION insert_ordertimes();