var mongoClient = require('mongodb').MongoClient;
var	assert = require('assert');
var url = 'mongodb://Ande:DOHOTHPrTuAsS7@localhost:27017/data';
var modelo = require('../../model/model');

var dias = function(req, res){
	var id = req.params.id;
	var dias = req.query.fecha;

	mongoClient.connect(url, {server:{poolSize:1}}, function(err, db){
		assert(err, null, ["can't connect to db"]);
		modelo.historial.zonas.dias(db, id, dias, function(docs){
			db.close();
			res.json(docs);
		});		
	});
};

var meses = function(req, res){
	var id = req.params.id;
	var meses = req.query.fecha;

	mongoClient.connect(url, {server:{poolSize:1}}, function(err, db){
		assert(err, null, ["can't connect to db"]);
		modelo.historial.zonas.meses(db, id, meses, function(docs){
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
		modelo.historial.zonas.años(db, id, años, function(docs){
			db.close();
			res.json(docs);
		});
	});
};

exports.dias = dias;
exports.meses = meses;
exports.años = años;
