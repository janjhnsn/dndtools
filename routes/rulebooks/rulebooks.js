var endpoint = "/rulebooks";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_rulebook.id AS guid, dnd_rulebook.*, dnd_dndedition.id AS edition_id, dnd_dndedition.name AS edition_name, dnd_dndedition.slug AS edition_slug FROM dnd_rulebook
            LEFT OUTER JOIN dnd_dndedition ON dnd_rulebook.dnd_edition_id = dnd_dndedition.id`;

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