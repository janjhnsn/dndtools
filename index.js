var sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('dnd.sqlite'),
	express = require('express'),
	app = express();
s
var endpoints = ['feat', 'race', 'skill', 'skillvariant', 'monster', 'characterclass', 'domain'];

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

console.log("Registering endpoint: /");
app.get('/', function(req, res){
    res.send('hello ROOT world');
});

/*console.log("Registering endpoint: /feat");
app.get('/feats', function(req, res){
    
	console.log(req.query.limit);
	
	var result = [];
	
	db.serialize(function() {
		db.each("SELECT * FROM dnd_feat", function(err, row) {
			result.push(row);
		}, function() {
			res.json(result);
		});
	});
});*/

app.listen(3000);