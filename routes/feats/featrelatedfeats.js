var endpoint = "/feats/related";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* FEAT RELATED ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {
            
            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];

            var sql = `SELECT dnd_feat.id AS guid, * FROM dnd_feat
                    LEFT OUTER JOIN dnd_rulebook ON dnd_feat.rulebook_id = dnd_rulebook.id`;

            if (sqlParams.id) {
                sql += " WHERE dnd_feat.slug = (SELECT dnd_feat.slug FROM dnd_feat LEFT OUTER JOIN dnd_rulebook ON dnd_feat.rulebook_id = dnd_rulebook.id WHERE dnd_feat.id = " + sqlParams.id + ")";
                sqlParams.id = undefined;
            }
            else {
                res.json({});
            }

            db.serialize(() => {
                db.each(sqlHelper.addSqlParam(sql, sqlParams), (err, row) => {
                    result.push(row);
                }, () => {
                    res.json(result);
                });
            });
        })
    }
}