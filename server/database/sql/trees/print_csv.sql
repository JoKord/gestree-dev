SELECT a.*,
(
    SELECT COUNT(*)::integer
    FROM "PSalgadas"."Interventions" old
    WHERE old.id_tree = a.gid AND state != 'ABERTA'
) as "Intervenções Fechadas",
(
    SELECT COUNT(*)::integer
    FROM "PSalgadas"."Interventions" old
    WHERE old.id_tree = a.gid AND state = 'ABERTA'
) as "Intervenções Abertas"
FROM "PSalgadas".arvores a