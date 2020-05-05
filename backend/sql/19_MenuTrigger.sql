CREATE OR REPLACE FUNCTION forbid_same_foodname_in_res()
RETURNS TRIGGER AS $$
DECLARE
	count integer;
BEGIN
	SELECT COUNT(*) INTO count FROM Menu M WHERE NEW.foodName = M.foodName and NEW.restaurantId = M.restaurantId and NEW.foodId <> M.foodId;
	IF count > 0 THEN
		RAISE EXCEPTION '% already exists in the restaurant', NEW.foodName;
		RETURN NULL;
	END IF;
	RETURN NEW;
END; 
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS menu_trigger on Menu CASCADE;
CREATE TRIGGER menu_trigger
BEFORE INSERT OR UPDATE
ON Menu
FOR EACH ROW
EXECUTE FUNCTION forbid_same_foodname_in_res();