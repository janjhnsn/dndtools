var sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('dnd.sqlite'),
	express = require('express'),
	app = express();

function addSqlParam(sql, params) {
	if (params.id) {
		sql += " WHERE guid = " + params.id;
	}

	if (params.limit) {
		sql += " LIMIT " + params.limit;
	}

	return sql;
}

function getSqlParams(req) {
	return {
		id: req.query.id,
		limit: req.query.limit
	}
}

/* GENERAL FOREACH ENDPOINT */

var endpoints = ['race', 'skill', 'skillvariant', 'monster', 'domain'];
endpoints.forEach(function(e) {

	console.log("Registering endpoint: /" + e);
	app.get('/' + e, function(req, res){
		
		console.log(req.query.limit);
		
		var result = [];
		
		db.serialize(function() {
			db.each("SELECT * FROM dnd_" + e, function(err, row) {
				result.push(row);
			}, function() {
				res.json(result);
			});
		});
	});

});

/* DEFAULT ENDPOINT */
console.log("Registering endpoint: /");
app.get('/', function(req, res){
    res.send('hello ROOT world');
});


/* FEAT ENDPOINT */
console.log("Registering endpoint: /feat");
app.get('/feat', function(req, res){
    
	var result = [];
	
	db.serialize(function() {
		db.each("SELECT * FROM dnd_feat", function(err, row) {
			result.push(row);
		}, function() {
			res.json(result);
		});
	});
});

/* CHARACTERCLASS ENDPOINT */
console.log("Registering endpoint: /characterclass");
app.get('/characterclass', function(req, res){
	
	var sqlParams = getSqlParams(req);

	var result = [];
	
	db.serialize(function() {
		db.each(addSqlParam(`SELECT dnd_characterclassvariant.id AS guid, * FROM dnd_characterclassvariant 
				 			 LEFT OUTER JOIN dnd_characterclass ON dnd_characterclassvariant.character_class_id = dnd_characterclass.id 
							 LEFT OUTER JOIN dnd_rulebook ON dnd_characterclassvariant.rulebook_id = dnd_rulebook.id`, sqlParams), function(err, row) {
			result.push(row);
		}, function() {
			res.json(result);
		});
	});
});

app.listen(3000);