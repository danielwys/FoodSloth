CREATE OR REPLACE FUNCTION check_interval()
RETURNS TRIGGER AS $$
DECLARE
	starth	integer;
	endh	integer;
BEGIN
	SELECT NEW.hourstart, NEW.hourend INTO starth, endh
		FROM NEW;
	IF starth > endh THEN
		RAISE EXCEPTION 'The start time must be later than the end time,';
		RETURN NULL;
	END IF;
	IF endh - starth >= 5 THEN
		RAISE EXCEPTION 'The max shift interval is 4 hours.';
		RETURN NULL;
	END IF;
	RETURN NEW;
END; 
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS check_interval_trigger on WWS CASCADE;
CREATE TRIGGER check_interval_trigger
	BEFORE INSERT OR UPDATE
	ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_interval();


CREATE OR REPLACE FUNCTION check_minimum_hours()
RETURNS TRIGGER AS $$
DECLARE
	total	integer;
BEGIN
	SELECT SUM(W.hourend - W.hourstart) INTO total
		FROM WWS W
		WHERE WWS.riderid = NEW.riderid;
	IF total < 10 THEN
		RAISE EXCEPTION 'The minimum work hours is 10 hours';
	END IF;
	IF total > 48 THEN
		RAISE EXCEPTION 'The maximum work hours is 48 hours';
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS check_minimum_hours_trigger on WWS CASCADE;
CREATE TRIGGER check_minimum_hours_trigger
	AFTER INSERT OR UPDATE
	ON WWS
	FOR EACH STATEMENT
	EXECUTE FUNCTION check_minimum_hours();