set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_total_bouteilles_collecte()
 RETURNS integer
 LANGUAGE sql
 SECURITY DEFINER
AS $function$SELECT
  SUM(collecte_nb_bouteilles) 
  --- lavage à façon
  + 23500 
  as "sum"
FROM
  collecte as c
  LEFT JOIN point_de_collecte AS pc ON c.point_de_collecte_id = pc.id
  LEFT JOIN tournee AS t on c.tournee_id = t.id
WHERE
  -- Entrepôt Eurocoop
  c.point_de_collecte_id <> 3 
  --- Agile en ville
  AND t.transporteur_id <> 3;$function$
;


