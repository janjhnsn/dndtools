var endpoint = "/feat/related/feats";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* FEAT RELATED ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {
            
            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];

            var sql = `SELECT dnd_feat.id AS guid, * FROM dnd_feat
                    LEFT OUTER JOIN dnd_rulebook ON dnd_feat.rulebook_id = dnd_rulebook.id`;

            if (sqlParams.guid) {
                sql += " WHERE dnd_feat.slug = (SELECT dnd_feat.slug FROM dnd_feat LEFT OUTER JOIN dnd_rulebook ON dnd_feat.rulebook_id = dnd_rulebook.id WHERE dnd_feat.id = " + sqlParams.guid + ")";
            }
            else {
                sql += " WHERE guid = 0";
            }
			
			sqlParams.guid = undefined;

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