var endpoint = "/feats";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_feat.id AS guid, dnd_feat.*, dnd_rulebook.id AS rulebook_id, dnd_rulebook.name AS rulebook_name FROM dnd_feat
                        LEFT OUTER JOIN dnd_rulebook ON dnd_feat.rulebook_id = dnd_rulebook.id`;

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