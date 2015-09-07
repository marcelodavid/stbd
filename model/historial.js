var assert = require('assert');

var abonado = function(db, data){
	var collection = db.collection('historial');
	
	collection.ensureIndex({fecha: -1, abonado_id: 1}, function(err, success){
		assert.equal(err, null, ['error al indexar los atributos']);
	});

	collection.insert(data, function(err, success){
		assert.equal(err, null, ['error al insertar los datos']);
		assert.equal(success.result.n, 1);
		db.close();
	});
}

var resumen_de_abonado = function(db, id, fecha, callback){
	var collection = db.collection('historial');

	collection.find({abonado_id: id, fecha:{$gt: fecha}}, {_id:0}).toArray(function(err, docs){
		callback(docs);
		db.close();
	});
}

var resumen_de_zona = function(db, id, fecha, callback){
	var collection = db.collection('historial');

	collection.find({zona_id:id, fecha:{$gt:fecha}}, {_id:0}).toArray(function(err, docs){
		callback(docs);
		db.close();
	});
}

exports.abonado = abonado;
exports.resumen_de_abonado = resumen_de_abonado;
exports.resumen_de_zona = resumen_de_zona;
