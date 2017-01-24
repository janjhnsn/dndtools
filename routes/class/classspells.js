var endpoint = "/class/spells";


module.exports = {
    setup: (app, db, sqlHelper) => {
        /* SPELL ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {

            var sqlParams = sqlHelper.getSqlParams(req);

            var result = [];
            
            var sql = `SELECT dnd_spellclasslevel.character_class_id AS guid, 
            dnd_spellclasslevel.level, dnd_spellclasslevel.extra, 
            dnd_spell.id, dnd_spell.name, dnd_spell.slug,
            dnd_spellschool.id AS spellschool_id, dnd_spellschool.name AS spellschool_name, dnd_spellschool.slug AS spellschool_slug, 
            dnd_rulebook.id AS rulebook_id, dnd_rulebook.name AS rulebook_name, dnd_rulebook.slug AS rulebook_slug, 
            dnd_dndedition.id AS edition_id, dnd_dndedition.name AS edition_name, dnd_dndedition.slug AS edition_slug
            FROM dnd_spellclasslevel 
            LEFT OUTER JOIN dnd_spell ON dnd_spellclasslevel.spell_id = dnd_spell.id
            LEFT OUTER JOIN dnd_spellschool ON dnd_spell.school_id = dnd_spellschool.id
            LEFT OUTER JOIN dnd_rulebook ON dnd_spell.rulebook_id = dnd_rulebook.id
            LEFT OUTER JOIN dnd_dndedition ON dnd_rulebook.dnd_edition_id = dnd_dndedition.id`;

            if (sqlParams.guid) {
                sql += " WHERE dnd_spellclasslevel.character_class_id = (SELECT dnd_characterclassvariant.character_class_id FROM dnd_characterclassvariant WHERE dnd_characterclassvariant.id = " + sqlParams.guid + ")";
                sqlParams.guid = undefined;
            } else {
				sql += " WHERE guid = 0";
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