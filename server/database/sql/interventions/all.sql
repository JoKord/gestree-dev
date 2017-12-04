SELECT i.*,
ty.value as type,
t.zona as zone
FROM "PSalgadas"."Interventions" i
JOIN "PSalgadas"."InterventionTypes" ty ON i.id_type = ty.id
JOIN "PSalgadas".trees t ON i.id_tree = t.gid;