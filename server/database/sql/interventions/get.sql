SELECT i.*, 
ty.value as value_type,
(SELECT row_to_json(tree) as tree
 FROM ( 
 SELECT a.*
 FROM "PSalgadas".trees a
 WHERE a.gid = i.id_tree) tree)
FROM "Interventions"."Interventions" as i
JOIN "Interventions"."InterventionTypes" ty ON i.id_type = ty.id
WHERE i.id = ${iid}