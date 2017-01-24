var endpoint = "/skills";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_skillvariant.id AS guid, dnd_skill.name, dnd_skill.slug, dnd_rulebook.id AS rulebook_id, dnd_rulebook.name AS rulebook_name, dnd_rulebook.slug AS rulebook_slug, dnd_dndedition.id AS edition_id, dnd_dndedition.name AS edition_name, dnd_dndedition.slug AS edition_slug FROM dnd_skillvariant 
            LEFT OUTER JOIN dnd_skill ON dnd_skillvariant.skill_id = dnd_skill.id 
            LEFT OUTER JOIN dnd_rulebook ON dnd_skillvariant.rulebook_id = dnd_rulebook.id
			LEFT OUTER JOIN dnd_dndedition ON dnd_rulebook.dnd_edition_id = dnd_dndedition.id`;

            if (sqlParams.guid) {
                sql += " WHERE guid = 0";
                sqlParams.guid = undefined;
            }

            db.serialize(() => {
                db.each(sqlHelper.addSqlParam(sql, sqlParams), function(err, row) {
                    result.push(row);
                }, () => {
                    res.json(result);
                });
            });
        });
    }
}