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
  'featrelated',
  'characterclass',
  'spell'
].map((controllerName) => {
  controller = require('./routes/' + controllerName);
  controller.setup(app, db);
});

app.listen(3000);