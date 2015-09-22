var assert = require('assert');
var nueva = function(db, data, callback){
	var collection = db.collection('zona');
	collection.ensureIndex({nombre: 1}, function(err, success){
		assert.equal(err, null, ['error al indexar los atributos']);
	});
	collection.insert(data, function(err, success){
		assert.equal(err, null);
		assert.equal(success.result.n, 1);
		callback();
	});
};
var actualizar = function(db, query, data, callback){
	var collection = db.collection('zona');
	collection.update({_id:query}, {$set:data}, function(err, success){
		assert.equal(err, null);
		callback();
	});
};
var buscar = function(db, callback){
	var collection = db.collection('zona');
	collection.find({}).toArray(function(err, docs){
		callback(docs);
	});
};
exports.nueva = nueva;
exports.actualizar = actualizar;
exports.buscar = buscar;
