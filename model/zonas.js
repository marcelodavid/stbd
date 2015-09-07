var assert = require('assert');

var nueva = function(db, data){
	var collection = db.collection('zona');

	collection.ensureIndex({name: 1}, function(err, success){
		assert.equal(err, null, ['error al indexar los atributos']);
	});

	collection.insert(data, function(err, success){
		assert.equal(err, null, ['error al insertar los datos']);
		assert.equal(success.result.n, 1);
		db.close();
	});
};

var buscar = function(db, callback){
	var collection = db.collection('zona');

	collection.find({}, {_id:0}).toArray(function(err, docs){
		callback(docs);
		db.close();
	});
}

exports.nueva = nueva;
exports.buscar = buscar;
