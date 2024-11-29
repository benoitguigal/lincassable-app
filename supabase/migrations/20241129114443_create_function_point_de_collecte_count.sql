set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_point_de_collecte_count()
 RETURNS integer
 LANGUAGE sql
 SECURITY DEFINER
AS $function$select count(*) from point_de_collecte where statut <> 'archive';$function$
;


