var endpoint = "/monsters";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_monster.id AS guid, dnd_monster.*, dnd_racesize.name AS size_name FROM dnd_monster
			LEFT OUTER JOIN dnd_racesize ON dnd_monster.size_id = dnd_racesize.id`;

            if (sqlParams.guid) {
                sql += " WHERE guid = " + sqlParams.guid + "";
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