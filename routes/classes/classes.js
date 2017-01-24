var endpoint = "/classes";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* CHARACTERCLASS ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_characterclassvariant.id AS guid, dnd_characterclass.name, dnd_characterclass.prestige, dnd_rulebook.id AS rulebook_id, dnd_rulebook.name AS rulebook_name, dnd_rulebook.slug AS rulebook_slug, dnd_dndedition.id AS edition_id, dnd_dndedition.name AS edition_name, dnd_dndedition.slug AS edition_slug FROM dnd_characterclassvariant 
			LEFT OUTER JOIN dnd_characterclass ON dnd_characterclassvariant.character_class_id = dnd_characterclass.id 
			LEFT OUTER JOIN dnd_rulebook ON dnd_characterclassvariant.rulebook_id = dnd_rulebook.id
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