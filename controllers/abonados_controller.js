var mongoClient = require('mongodb').MongoClient;
var	assert = require('assert');
var modelo = require('../model/model');
var url = 'mongodb://localhost:27017/data';
var abonado = function(req, res){
	console.log(req.params.id);
	var abonado = {
			"NIS": "123abc",
			"nombre": "Marcelo David Arevalos",
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
		};
	res.render('abonados', {abonado: abonado});
} ;
var buscar = function(req, res){
	var generico = req.query.generico;
	res.json({
			"NIS": "123abc",
			"nombre": "Marcelo David Arevalos",
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
		});
	/*mongoClient.connect(url, {server: {poolSize: 1}}, function(err, db){
		assert.equal(err, null, ["can't connect to db"]);
		modelo.abonados.buscar(db, generico, function(docs){
			db.close();
			res.json(docs);
		});
	});*/
};
var mediciones = function(req, res){
	var id = req.params.id;
	/*mongoClient.connect(url, {server: {poolSize: 1}}, function(err, db){
		assert.equal(err, null, ["can't connect to db"]);
		modelo.abonados.mediciones(db, id, function(docs){
			db.close();
			res.json(docs);
		})
	});
	*/
	res.json([{
			"Energia Activa": "300*Kwh",
			"Demanda Maxima": "560*Kwh",
			"Corriente L1": "2*Amp",
			"Corriente L2": "1.2*Amp",
			"Corriente L3": "0*Amp",
			"Fecha": new Date(2015,2,16).getTime()
	}]);
}
exports.abonado = abonado;
exports.buscar = buscar;
exports.mediciones = mediciones;
