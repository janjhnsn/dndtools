var endpoint = "/monsters";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];

            db.serialize(() => {
                db.each(sqlHelper.addSqlParam(`SELECT dnd_monster.id AS guid, * FROM dnd_monster
                                                LEFT OUTER JOIN dnd_racesize ON dnd_monster.size_id = dnd_racesize.id`, sqlParams), function(err, row) {
                    result.push(row);
                }, () => {
                    res.json(result);
                });
            });
        });
    }
}