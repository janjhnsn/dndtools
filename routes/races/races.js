var endpoint = "/races";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];

            db.serialize(() => {
                db.each(sqlHelper.addSqlParam(`SELECT dnd_race.id AS guid, * FROM dnd_race
                                                LEFT OUTER JOIN dnd_racetype ON dnd_race.race_type_id = dnd_racetype.id
                                                LEFT OUTER JOIN dnd_rulebook ON dnd_race.rulebook_id = dnd_rulebook.id`, sqlParams), function(err, row) {
                    result.push(row);
                }, () => {
                    res.json(result);
                });
            });
        });
    }
}