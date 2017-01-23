var endpoint = "/monsters";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_monster.id AS guid, dnd_monster.*, dnd_racesize.name AS size_name FROM dnd_monster
                        LEFT OUTER JOIN dnd_racesize ON dnd_monster.size_id = dnd_racesize.id`;

            if (sqlParams.id) {
                sql += " WHERE guid = " + sqlParams.id + "";
                sqlParams.id = undefined;
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