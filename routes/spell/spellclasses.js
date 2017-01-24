var endpoint = "/spell/classes";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_spellclasslevel.spell_id AS guid, dnd_characterclass.* FROM dnd_spellclasslevel
            LEFT OUTER JOIN dnd_characterclass ON dnd_spellclasslevel.character_class_id = dnd_characterclass.id
            LEFT OUTER JOIN dnd_spell ON dnd_spellclasslevel.spell_id = dnd_spell.id`;

            if (sqlParams.guid) {
                sql += " WHERE guid = " + sqlParams.guid + "";
            }
            else {
                sql += " WHERE guid = 0";
            }
			
			sqlParams.guid = undefined;

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