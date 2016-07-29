var assert = require('assert');

// registra un usuario y sus coordenadas
var create = function(db, data, callback){
    var collection = db.collection('abonados');
    var	indexOptions = {min: -500, max: 500, w: 1};
    collection.ensureIndex(
            {localidad: "2dsphere"},
            indexOptions, 
            function(err,success){
                    assert.equal(err, null);
            }
    );
    collection.insert(data, function(err, success){
            assert.equal(err, null, ['error al insertar los datos']);
            callback();
    });
};

// actualiza los parametros del medidor de un usuario
var updateParameters = function(db, data, callback){
	var collection = db.collection('abonados');
	collection.update(	
	    {serial: data.serial},
	    {$set: {parametros:data.parametros}},
	    function(err, success){
		assert.equal(err, null);
		callback(db, data.serial);
	    }
	);
};

// retorna el resultado total o parcial de los medidores de un area
var area = function(db, lat, lng, radio, pagina, callback){
    if(!pagina){
        pagina = 1;
    }
    var limite = 50;
    var saltos = limite * (pagina - 1);
    var collection = db.collection('abonados');
    var cursor = collection.find({
        localidad:{
                $near: {
                        $geometry: {
                                type: "Point",
                                coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: parseFloat(radio)
                }
        }
    });
    cursor.skip(saltos).limit(limite).sort([['nombre', 1]]).toArray(function(err, docs){    // paginacion de los datos
            cursor.count(function(err, total){
                callback(docs, total);
            });
    });
};

//  retorna uno o varios abonados
var search = function(db, generico, callback){
    var collection = db.collection('abonados');
    collection.find({$or:[{ci:generico}, {nombre: generico}, {NIS: generico}, {serial: generico}]})
        .toArray(function(err, docs){
            callback(docs);
        });
};

// retorna la ultima medicion del abonado
var getMeassurement = function(db, id, callback){
	var collection = db.collection('abonados');
	collection.find({serial:id}, {_id:0, parametros:1})
            .toArray(function(err, docs){
                    callback(docs);
            });
};

exports.create = create;
exports.updateParameters = updateParameters;
exports.area = area;
exports.search = search;
exports.getMeassurement = getMeassurement;
