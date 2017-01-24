var endpoint = "/feats/categories/feats";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_feat_feat_categories.featcategory_id AS guid, dnd_feat.*, 
            dnd_featcategory.name AS category_name, dnd_featcategory.slug AS category_slug
            FROM dnd_feat_feat_categories
            LEFT OUTER JOIN dnd_featcategory ON dnd_featcategory.id = dnd_feat_feat_categories.featcategory_id
            LEFT OUTER JOIN dnd_feat ON dnd_feat.id = dnd_feat_feat_categories.feat_id`;

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