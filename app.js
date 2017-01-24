var sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('./data/dnd.sqlite'),
	express = require('express'),
	app = express(),
	sqlHelper = require('./helpers/sql');

[
    'default',
    'class/class',
    'class/classskills',
    'class/classspells',
    'classes/classes',
    'deities/deities',
    'items/items',
    'languages/languages',
    'monsters/monsters',
    'races/race',
    'races/races',
    'rulebooks/rulebooks',
    'skills/skill',
    'skills/skills',
    'spell/spell',
    'spells/spells'
].map((controllerName) => {
  controller = require('./routes/' + controllerName);
  controller.setup(app, db, sqlHelper);
});

app.listen(3000);