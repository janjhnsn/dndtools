var endpoint = "/class/dependency/skills";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_characterclassvariantrequiresskill.character_class_variant_id AS guid, dnd_characterclassvariantrequiresskill.*, dnd_skill.*
            FROM dnd_characterclassvariantrequiresskill
            LEFT OUTER JOIN dnd_skill ON dnd_characterclassvariantrequiresskill.skill_id = dnd_skill.id`;

            if (sqlParams.guid) {
                sql += " WHERE guid = " + sqlParams.guid + "";
                sqlParams.guid = undefined;
            } else {
				sql += " WHERE guid = 0";
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