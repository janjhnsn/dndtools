var sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('dnd.sqlite'),
	express = require('express'),
	app = express();

function addSqlParam(sql, params) {
	var extraSql = '';
	if (params.id) {
		extraSql = addAndToSql(extraSql);
		extraSql += " guid = " + params.id;
	}

	if (params.rulebook) {
		extraSql = addAndToSql(extraSql);
		extraSql += " rulebook = " + params.rulebook;
	}

	if (params.school) {
		extraSql = addAndToSql(extraSql);
		extraSql += " school = " + params.school;
	}

	if (params.subschool) {
		extraSql = addAndToSql(extraSql);
		extraSql += " subschool = " + params.subschool;
	}

	if (params.limit) {
		extraSql += " LIMIT " + params.limit;
	}
	console.log('SQL: ', sql + extraSql);
	return sql + extraSql;
}

function getSqlParams(req) {
	return {
		id: req.query.id,
		limit: req.query.limit,
		rulebook: req.query.rulebook,
		school: req.query.school,
		subschool: req.query.subschool
	}
}

function addAndToSql(sql) {
	if (sql.indexOf("WHERE") != -1) {
		sql += " AND";
	} else {
		sql += " WHERE";
	}

	return sql;
}

/* GENERAL FOREACH ENDPOINT */
var endpoints = ['feat', 'race', 'skill', 'skillvariant', 'monster', 'domain'];
endpoints.forEach((e) => {

	console.log("Registering endpoint: /" + e);
	app.get('/' + e, (req, res) => {
		
		var sqlParams = getSqlParams(req);

		var result = [];
		
		db.serialize(() => {
			db.each(addSqlParam("SELECT id AS guid, * FROM dnd_" + e, sqlParams), (err, row) => {
				result.push(row);
			}, () => {
				res.json(result);
			});
		});
	});

});

/* DEFAULT ENDPOINT */
console.log("Registering endpoint: /");
app.get('/', (req, res) => {
    res.send('hello ROOT world');
});

/* FEAT RELATED ENDPOINT */
console.log("Registering endpoint: /feat/related");
app.get('/feat/related', (req, res) => {
    
	var sqlParams = getSqlParams(req);

	var result = [];

	var sql = `SELECT dnd_feat.id AS guid, * FROM dnd_feat
			   LEFT OUTER JOIN dnd_rulebook ON dnd_feat.rulebook_id = dnd_rulebook.id`;

	if (sqlParams.id) {
		sql += " WHERE dnd_feat.slug = (SELECT dnd_feat.slug FROM dnd_feat LEFT OUTER JOIN dnd_rulebook ON dnd_feat.rulebook_id = dnd_rulebook.id WHERE dnd_feat.id = " + sqlParams.id + ")";
		sqlParams.id = undefined;
	}

	db.serialize(() => {
		db.each(addSqlParam(sql, sqlParams), (err, row) => {
			result.push(row);
		}, () => {
			res.json(result);
		});
	});
});

/* CHARACTERCLASS ENDPOINT */
console.log("Registering endpoint: /characterclass");
app.get('/characterclass', (req, res) => {
	
	var sqlParams = getSqlParams(req);

	var result = [];
	
	db.serialize(() => {
		db.each(addSqlParam(`SELECT dnd_characterclassvariant.id AS guid, * FROM dnd_characterclassvariant 
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
	
	var sqlParams = getSqlParams(req);

	var result = [];
	
	db.serialize(() => {
		db.each(addSqlParam(`SELECT dnd_spell.id AS guid, dnd_spell.rulebook_id AS rulebook, dnd_spell.school_id AS school, dnd_spell.sub_school_id AS subschool, * FROM dnd_spell
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