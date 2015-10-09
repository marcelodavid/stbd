var assert = require('assert');
var dias = function(db, id, fecha, callback){
	var collection = db.collection('historial');
	collection.find({resumen_id: id, fecha:{$gt: fecha}}, {_id:0}).toArray(function(err, docs){
		assert(err, null);
		callback(docs);
	});
};
var meses = function(db, id, meses,   callback){
	var collection = db.collection('historial');
	collection.find({resumen_id: id, fecha: {$in:meses}}, {_id:0}).toArray(function(err, docs){
		assert(err, null);
		callback(docs);
	});
};
var años = function(db, id, años,callback){
	var collection = db.collection('historial');
	collection.find({resumen_id: id, fecha: {$in:años}}, {_id:0}).toArray(function(err, docs){
		assert(err, null);
		callback(docs);
	});
};

exports.dias = dias;
exports.meses = meses;
exports.años = años;
