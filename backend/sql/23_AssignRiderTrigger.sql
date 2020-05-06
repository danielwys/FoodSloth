CREATE OR REPLACE FUNCTION assign_rider() RETURNS TRIGGER AS $$

DECLARE
    rider     integer;

BEGIN
    SELECT W.riderid into rider
    FROM WorkingRiders W
    ORDER BY W.currentorders ASC
    LIMIT 1;

    IF rider IS NOT NULL THEN
        NEW.riderid = rider;
    END IF;
    RETURN NEW;

END;

$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assign_rider_trigger ON Orders CASCADE;
CREATE TRIGGER assign_rider_trigger
    BEFORE INSERT ON Orders
    FOR EACH ROW 
    EXECUTE FUNCTION assign_rider();