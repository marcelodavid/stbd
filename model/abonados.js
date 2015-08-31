var assert = require('assert');

var registar = function(db, data){
	var collection = db.collection('abonados'),
		indexOptions = {min: -500, max: 500, w: 1};
	
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
			console.log('datos insertados correctamente');
		}
	);
};

var actualizar_medicion = function(db, data, callback){
	var collection = db.collection('abonados');

	collection.update(	
		{meterid: data.meterid},
		{$set:{meassure: data.meassure}}
	);

	callback(data.meterid);
};

var buscar = function(db, lat, lng, radio, callback){
	var collection = db.collection('home');

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
			db.close();
	});	
};

exports.registar = registar;
exports.actualizar_medicion = actualizar_medicion;
exports.buscar = buscar;
