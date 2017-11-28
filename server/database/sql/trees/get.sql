SELECT a.*,
(
    SELECT COUNT(*)::integer
    FROM "PSalgadas"."Interventions" old
    WHERE old.id_tree = a.gid AND state != 'ABERTA'
) as closed_interventions,
(
    SELECT COUNT(*)::integer
    FROM "PSalgadas"."Interventions" old
    WHERE old.id_tree = a.gid AND state = 'ABERTA'
) as open_interventions
FROM "PSalgadas".arvores a
WHERE a.gid = ${tid}