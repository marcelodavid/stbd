var assert = require('assert');

// retorna resumenes de los dias a partir de fecha
var dias = function(db, id, fecha, callback){
	var collection = db.collection('historial');
	collection.find({resumen_id: id, 'fecha':{$gt: fecha}}, {_id:0}).toArray(function(err, docs){
		assert.equal(err, null);
		callback(docs);
	});
};

// retorna resumenes por meses a partir de meses
var meses = function(db, id, meses,   callback){
	var collection = db.collection('historial');
	collection.find({resumen_id: id, fecha: {$in:meses}}, {_id:0}).toArray(function(err, docs){
		assert.equal(err, null);
		callback(docs);
	});
};

// retorna resumenes por año
var años = function(db, id, años,callback){
	var collection = db.collection('historial');
	collection.find({resumen_id: id, fecha: {$in:años}}, {_id:0}).toArray(function(err, docs){
		assert.equal(err, null);
		callback(docs);
	});
};

exports.dias = dias;
exports.meses = meses;
exports.años = años;
