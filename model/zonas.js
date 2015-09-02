var assert = require('assert');

var nueva = function(db, data, callback){
	var collection = db.collection('zone');

	collection.insert(data, function(err, success){
		assert.equal(err, null, ['error al insertar los datos']);
		assert.equal(success.result.n, 1);
	});

	collection.ensureIndex({name: 1}, function(err, success){
		assert.equal(err, null, ['error al indexar los atributos']);
	});
};

exports.nueva = nueva;
