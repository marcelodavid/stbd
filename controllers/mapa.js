var mongoClient = require('mongodb').MongoClient;
var	assert = require('assert');

var modelo = require('../model/model');

var url = 'mongodb://Ande:DOHOTHPrTuAsS7@localhost:27017/data';

// renderiza un template con el mapa
var mapa = function(req, res){
	res.render('mapa',{});
};

// retorna todos los usuarios del mapa con datos de los medidores
var area = function(query, callback){
    var lng = query.lng,
	lat = query.lat,
	radio = query.radio,
        pagina = query.pagina;

    mongoClient.connect(url, {server: {poolSize: 5}}, function(err, db){
	assert.equal(err, null, ["can't connect to db"]);

	modelo.abonados.area(db, lat, lng, radio, pagina, function(docs, total){
	    db.close();
            callback(docs, total);
	});
    });
};
exports.mapa = mapa;
exports.area = area;
