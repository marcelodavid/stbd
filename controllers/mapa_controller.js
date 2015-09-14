var mongoClient = require('mongodb').MongoClient;
var	assert = require('assert');

var modelo = require('../model/model');

var url = 'mongodb://localhost:27017/data';

var mapa = function(req, res){
	res.render('mapa',{});
};

var mediciones = function(req, res){
	var array = [
		{
			"NIS": "123abc",
			"usuario": "Marcelo David Arevalos",
			"ci" : "2.909.678",
			"localidad": {
				"type": "Point",
				"coordinates": [-27, -54]
			},
			"mail": "marceaagg@gmail.com",
			"ruc": "2979427",
			"telefono": "0972 279-858",
			"serial": "123abc",
			"parametros": {
				"Energia Activa": "300*Kwh",
				"Demanda Maxima": "560*Kwh",
				"Corriente L1": "2*Amp",
				"Corriente L2": "1.2*Amp",
				"Corriente L3": "0*Amp",
				"Fecha": new Date(2015,2,16).getTime()
			}
		},
		{
			"NIS": "456abc",
			"usuario": "Eduardo Ramon Medina Casco",
			"ci" : "3.123.456",
			"localidad": {
				"type": "Point",
				"coordinates": [-28, -54]
			},
			"mail": "edud77@gmail.com",
			"ruc": "3123456",
			"telefono": "021 641-181",
			"serial": "456abc",
			"parametros": {
				"Energia Activa": "450*Kwh",
				"Demanda Maxima": "800*Kwh",
				"Corriente L1": "2.6*Amp",
				"Corriente L2": "0.8*Amp",
				"Corriente L3": "1.5*Amp",
				"Fecha": new Date(2015,1,12).getTime()
			}
		}
	];
	res.json(array);
/*	var lng = req.query.lng,
		lat = req.query.lat,
		radio = req.query.radio;

	mongoClient.connect(url, {server: {poolSize: 1}}, function(err, db){
		assert.equal(err, null, ["can't connect to db"]);

		modelo.abonados.buscar_mapa(db, lat, lng, radio, function(docs){
			res.json(docs);
		});
	});*/
};

exports.mapa = mapa;
exports.mediciones = mediciones;
