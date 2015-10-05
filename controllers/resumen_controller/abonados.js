var mongoClient = require('mongodb').MongoClient;
var	assert = require('assert');
var url = 'mongodb://localhost:27017/data';
var modelo = require('../../model/model');

var dias = function(req, res){
	var id = req.params.id;
	var dias = req.query.fecha;

	var docs = [
		{fecha:152574255383232, activatotal:100},
		{fecha:217531257725372, activatotal:110},
		{fecha:318268261823232, activatotal:120},
	]

	res.json(docs);

	/*mongoClient.connect(url, {server:{poolSize:1}}, function(err, db){
		assert(err, null, ["can't connect to db"]);
		modelo.historial.abonados.dias(db, id, dias, function(docs){
			db.close();
			res.json(docs);
		});		
	});*/
};

var meses = function(req, res){
	var id = req.params.id;
	var meses = req.query.fecha;

	mongoClient.connect(url, {server:{poolSize:1}}, function(err, db){
		assert(err, null, ["can't connect to db"]);
		modelo.historial.abonados.meses(db, id, meses, function(docs){
			db.close();
			res.json(docs);
		});
	});
};

var años = function(req, res){
	var id = req.params.id;
	var años = req.query.fecha;

	mongoClient.connect(url, {server:{poolSize:1}}, function(err, db){
		assert(err, null, ["can't connect to db"]);
		modelo.historial.abonados.años(db, id, años, function(docs){
			db.close();
			res.json(docs);
		});
	});
};

exports.dias = dias;
exports.meses = meses;
exports.años = años;
