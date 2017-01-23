var sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('dnd.sqlite'),
	express = require('express'),
	app = express(),
	sqlHelper = require('./helpers/sql');


/* GENERAL FOREACH ENDPOINT */
var endpoints = ['feat', 'race', 'skill', 'skillvariant', 'monster', 'domain'];
endpoints.forEach((e) => {

	console.log("Registering endpoint: /" + e);
	app.get('/' + e, (req, res) => {
		
		var sqlParams = sqlHelper.getSqlParams(req);

		var result = [];
		
		db.serialize(() => {
			db.each(sqlHelper.addSqlParam("SELECT id AS guid, * FROM dnd_" + e, sqlParams), (err, row) => {
				result.push(row);
			}, () => {
				res.json(result);
			});
		});
	});

});

//var _default = require('./routes/default.js');

//_default.setup(app);


[
  'default',
  'featrelated'
].map((controllerName) => {
  controller = require('./routes/' + controllerName);
  controller.setup(app, db);
});


/* CHARACTERCLASS ENDPOINT */
console.log("Registering endpoint: /characterclass");
app.get('/characterclass', (req, res) => {
	
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

/* SPELL ENDPOINT */
console.log("Registering endpoint: /spell");
app.get('/spell', (req, res) => {
	
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

app.listen(3000);