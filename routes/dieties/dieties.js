var endpoint = "/deities";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_deity.id AS guid, dnd_deity.* FROM dnd_deity`;

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