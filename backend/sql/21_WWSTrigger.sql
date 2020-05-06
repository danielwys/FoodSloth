CREATE OR REPLACE FUNCTION check_minimum_hours()
RETURNS TRIGGER AS $$
DECLARE
	total	integer;
BEGIN
	SELECT SUM(W.hourend - W.hourstart) INTO total
		FROM WWS W
		WHERE W.riderid = OLD.riderid;
	IF total < 10 + (OLD.hourend - OLD.hourstart) THEN
		RAISE EXCEPTION 'The minimum work hours is 10 hours';
		RETURN NULL;
	END IF;
	RETURN OLD;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS check_minimum_hours_trigger on WWS CASCADE;
CREATE TRIGGER check_minimum_hours_trigger
	BEFORE UPDATE OR DELETE
	ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_minimum_hours();


CREATE OR REPLACE FUNCTION check_maximum_hours()
RETURNS TRIGGER AS $$
DECLARE
	total	integer;
BEGIN
	SELECT SUM(W.hourend - W.hourstart) INTO total
		FROM WWS W
		WHERE W.riderid = NEW.riderid;
	IF total > 48 THEN
		RAISE EXCEPTION 'The maximum work hours is 48 hours';
		RETURN NULL;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS check_maximum_hours_trigger on WWS CASCADE;
CREATE TRIGGER check_maximum_hours_trigger
	BEFORE INSERT OR UPDATE
	ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_maximum_hours();


CREATE OR REPLACE FUNCTION check_overlap_hours()
RETURNS TRIGGER AS $$
DECLARE
	day 	integer;
BEGIN
	SELECT W.day INTO day
		FROM WWS W
		WHERE W.riderid = NEW.riderid
		AND W.day = NEW.day
		AND (NEW.hourstart > W.hourstart AND W.hourend > NEW.hourstart)
		OR (W.hourstart > NEW.hourstart AND NEW.hourend > W.hourstart)
		OR (W.hourstart < NEW.hourstart AND W.hourend > NEW.hourend);
	IF day IS NOT NULL THEN
		RAISE EXCEPTION 'There cannot be overlapping times.';
		RETURN NULL;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS check_overlap_hours_trigger on WWS CASCADE;
CREATE TRIGGER check_overlap_hours_trigger
	BEFORE INSERT OR UPDATE
	ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_overlap_hours();


CREATE OR REPLACE FUNCTION check_hour_spacing()
RETURNS TRIGGER AS $$
DECLARE
	day 	integer;
BEGIN
	SELECT W.day INTO day
		FROM WWS W
		WHERE W.riderid = NEW.riderid
		AND W.day = NEW.day
		AND NEW.hourstart - W.hourend < 1
		OR W.hourstart - NEW.hourend < 1;
	IF day IS NOT NULL THEN
		RAISE EXCEPTION 'There must be a 1 hour break between slots.';
		RETURN NULL;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS check_hour_spacing_trigger on WWS CASCADE;
CREATE TRIGGER check_hour_spacing_trigger
	BEFORE INSERT OR UPDATE
	ON WWS
	FOR EACH ROW
	EXECUTE FUNCTION check_hour_spacing();