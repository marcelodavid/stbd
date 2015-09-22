var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var	assert = require('assert');
var modelo = require('../model/model');
var url = 'mongodb://localhost:27017/data';
var nueva_zona= function(req, res){
	mongoClient.connect(url, function(err, db){
		assert.equal(err, null, ["can't connect to db"]);
		var zona = req.body;
		zona._id = new ObjectID();
		modelo.zonas.nueva(db, zona, function(){
			res.json(zona._id);
			db.close();
		});
	});
};
var actualizar_zona = function(req, res){
	mongoClient.connect(url, function(err, db){
		assert.equal(err, null);
		var query  = req.params.id;
		var zona =  req.body;
		modelo.zonas.actualizar(db, query, zona, function(){
			db.close();
		})
	});
};
exports.nueva_zona = nueva_zona;
exports.actualizar_zona = actualizar_zona;
