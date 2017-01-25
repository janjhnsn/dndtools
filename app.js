var sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('./data/dnd.sqlite'),
	express = require('express'),
	app = express(),
	sqlHelper = require('./helpers/sql');

[
    'default',
    'class/class',
    'class/classdependencyfeats',
    'class/classdependencyraces',
    'class/classdependencyskills',
    'class/classskills',
    'class/classspells',
    'classes/classes',
    'deities/deities',
    'feat/feat',
    'feat/featcategories',
    'feat/featdependencyfeats',
    'feat/featprerequisitefeats',
    'feat/featprerequisiteskills',
    'feat/featrelatedfeats',
    'feat/featrequirementsspecial',
    'feats/featcategories',
    'feats/featcategoryfeats',
    'feats/feats',
    'items/items',
    'languages/languages',
    'monsters/monsters',
    'races/race',
    'races/races',
    'rulebooks/rulebooks',
    'skills/skill',
    'skills/skills',
    'skills/skilltricks',
    'spell/spell',
    'spell/spellclasses',
    'spell/spelldescriptors',
    'spell/spelldomains',
    'spells/spells',
    'spells/spelldescriptors',
    'spells/spelldescriptorspells',
    'spells/spelldomains',
    'spells/spelldomainspells',
    'spells/spellschools',
    'spells/spellschoolspells',
    'spells/spellsubschools',
    'spells/spellsubschoolspells'
].map((controllerName) => {
  controller = require('./routes/' + controllerName);
  controller.setup(app, db, sqlHelper);
});

app.listen(80);