var endpoint = "/class/skills";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_characterclassvariant_class_skills.characterclassvariant_id AS guid, * FROM dnd_characterclassvariant_class_skills
            LEFT OUTER JOIN dnd_skill ON dnd_skill.id = dnd_characterclassvariant_class_skills.skill_id`;

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