var endpoint = "/race";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_race.id AS guid, dnd_race.*, dnd_rulebook.id AS rulebook_id, dnd_rulebook.name AS rulebook_name, dnd_rulebook.slug AS rulebook_slug, dnd_dndedition.id AS edition_id, dnd_dndedition.name AS edition_name, dnd_dndedition.slug AS edition_slug FROM dnd_race
            LEFT OUTER JOIN dnd_racetype ON dnd_race.race_type_id = dnd_racetype.id
            LEFT OUTER JOIN dnd_rulebook ON dnd_race.rulebook_id = dnd_rulebook.id
            LEFT OUTER JOIN dnd_dndedition ON dnd_rulebook.dnd_edition_id = dnd_dndedition.id`;

            if (sqlParams.guid) {
                sql += " WHERE guid = " + sqlParams.guid + "";
            } else {
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