CREATE OR REPLACE FUNCTION assign_rider_trigger () RETURNS TRIGGER AS $$

DECLARE
    riderId     integer;

BEGIN
    SELECT /* this is incomplete */

END;

$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assign_rider ON Orders CASCADE;
CREATE CONSTRAINT TRIGGER assign_rider
    AFTER INSERT OR UPDATE ON Orders
    FOR EACH ROW EXECUTE FUNCTION assign_rider_trigger();