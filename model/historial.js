var assert = require('assert');

var nueva_entrada = function(db, data, callback){
	var collection = db.collection('historial');
	
	collection.insert(data, function(err, success){
		assert.equal(err, null, ['error al insertar los datos']);
		assert.equal(success.result.n, 1);
	});

	collection.ensureIndex({time: -1, home_id: 1}, function(err, success){
		assert.equal(err, null, ['error al indexar los atributos']);
	});
}

exports.nueva_entrada = nueva_entrada;
