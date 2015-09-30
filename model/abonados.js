var assert = require('assert');
var registar = function(db, data, callback){
	var collection = db.collection('abonados');
	var	indexOptions = {min: -500, max: 500, w: 1};
	collection.ensureIndex(
		{localidad: "2dsphere"},
		indexOptions, 
		function(err,success){
			assert.equal(err, null);
		}
	);
	collection.insert(data, 
		function(err, success){
			assert.equal(err, null, ['error al insertar los datos']);
			assert.equal(1, success.result.n);
		}
	);
	callback();
};
var actualizar_medicion = function(db, data, callback){
	var collection = db.collection('abonados');
	collection.update(	
		{serial: data.serial},
		{$set:{meassure: data.meassure}},
		function(err, success){
			assert.equal(err, null);
			assert.equal(1, success.result.n);
			callback(data.serial);
		}
	);
};
var area = function(db, lat, lng, radio, callback){
	var collection = db.collection('abonados')
	collection.find({
		localidad:{
			$near: {
				$geometry: {
					type: "Point",
					coordinates: [parseFloat(lng), parseFloat(lat)]
				},
				$maxDistance: parseFloat(radio)
			}
		}
	})
	.toArray(function(err, docs){
			callback(docs);
	});	
};
var buscar = function(db, generico, callback){
	var collection = db.collection('abonados');
	collection.find({$or:[{nombre: generico}, {ci:generico}, {NIS: generico}]})
		.toArray(function(err, docs){
			callback(docs);
		});
};
var mediciones = function(db, id, callback){
	var collection = db.collection('abonados');
	collection.find({NIS:id}, {_id:0, parametros:1})
		.toArray(function(err, docs){
			callback(docs);
		});
};

exports.registar = registar;
exports.actualizar_medicion = actualizar_medicion;
exports.area = area;
exports.buscar = buscar;
exports.mediciones = mediciones;
