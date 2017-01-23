var endpoint = "/spells";
var sqlHelper = require('../../helpers/sql');

module.exports = {
    setup: (app, db) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];

            db.serialize(() => {
                db.each(sqlHelper.addSqlParam(`SELECT dnd_spell.id AS guid, dnd_spell.rulebook_id AS rulebook, dnd_spell.school_id AS school, dnd_spell.sub_school_id AS subschool, * FROM dnd_spell
                                    LEFT OUTER JOIN dnd_rulebook ON dnd_spell.rulebook_id = dnd_rulebook.id
                                    LEFT OUTER JOIN dnd_spellschool ON dnd_spell.school_id = dnd_spellschool.id
                                    LEFT OUTER JOIN dnd_spellsubschool ON dnd_spell.sub_school_id = dnd_spellsubschool.id`, sqlParams), function(err, row) {
                    result.push(row);
                }, () => {
                    res.json(result);
                });
            });
        });
    }
}