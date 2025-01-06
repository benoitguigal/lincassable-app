
ALTER TABLE "collecte"
ADD COLUMN "date" DATE;


-- Fonction pour mettre à jour la date d'une collecte lors de son insertion
CREATE OR REPLACE FUNCTION update_collecte_date_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifie si tournee_id est non nul avant de mettre à jour
  IF NEW."tournee_id" IS NOT NULL THEN
    UPDATE "collecte"
    SET "date" = (SELECT "date" FROM "tournee" WHERE "id" = NEW."tournee_id")
    WHERE "id" = NEW."id";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour appeler la fonction lors de l'insertion dans la table Collecte
CREATE TRIGGER trigger_update_collecte_date_on_insert
AFTER INSERT ON "collecte"
FOR EACH ROW
EXECUTE FUNCTION update_collecte_date_on_insert();

-- Fonction pour mettre à jour les dates des collectes d'une tournée lorsque la date de la tournée change
CREATE OR REPLACE FUNCTION update_collectes_on_tournee_date_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Met à jour toutes les collectes associées à la tournée dont la date a changé
  UPDATE "collecte"
  SET "date" = NEW."date"
  WHERE "tournee_id" = OLD."id";

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

