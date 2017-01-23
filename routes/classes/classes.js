var endpoint = "/classes";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* CHARACTERCLASS ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];

            db.serialize(() => {
                db.each(sqlHelper.addSqlParam(`SELECT dnd_characterclassvariant.id AS guid, * FROM dnd_characterclassvariant 
                                     LEFT OUTER JOIN dnd_characterclass ON dnd_characterclassvariant.character_class_id = dnd_characterclass.id 
                                     LEFT OUTER JOIN dnd_rulebook ON dnd_characterclassvariant.rulebook_id = dnd_rulebook.id`, sqlParams), function(err, row) {
                    result.push(row);
                }, () => {
                    res.json(result);
                });
            });
        });
    }
}