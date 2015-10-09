var abonados = require('./abonados');
var zonas = require('./zonas')

var assert = require('assert');
var entrada = function(db, data, id, fecha, callback){
	var collection = db.collection('historial');
	collection.ensureIndex({fecha: -1, resumen_id: 1}, function(err, success){
		assert.equal(err, null, ['error al indexar los atributos']);
	});
	collection.update({resumen_id: id, fecha: fecha}, data, {upsert:true}, function(err, success){
		assert.equal(err, null, ['error al insertar los datos']);
		callback();
	});
};

exports.entrada = entrada;
exports.abonados = abonados;
exports.zonas = zonas;
