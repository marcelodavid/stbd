var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var modelo = require('../model/model');
var url = 'mongodb://Ande:DOHOTHPrTuAsS7@localhost:27017/data';

// renderiza formulario para registar usuarios
var form = function(req, res){
	res.render('registrar', {});
};


// guarda los datos del formulario
var register = function(req, res){
	var user = req.body;
        console.log(user);

	mongoClient.connect(url, {server: {poolSize: 1}}, function(err, db){
		assert.equal(err, null, ["can't connect to db"]);
		modelo.abonados.create(db, user, function(){
			db.close();
		});
	});
};

// renderiza una pagina que presenta un informe detallado por usuario
var report = function(req, res){
	var id = req.params.id;
	mongoClient.connect(url, {server: {poolSize: 1}}, function(err, db){
		assert.equal(err, null, ["can't connect to db"]);
		modelo.abonados.search(db, id, function(docs){ 
		    db.close();
                    res.render('abonados', {abonado: docs[0]});
		})
	});	
};

// retorna un usuario por su NIS, ci o nombre
var search = function(req, res){
    var generico = req.query.generico;
    mongoClient.connect(url, {server: {poolSize: 1}}, function(err, db){
            assert.equal(err, null, ["can't connect to db"]);
            modelo.abonados.search(db, generico, function(docs){
                db.close();
                if(docs.length)
                    res.json({path:'/abonados/'+generico});
                else
                    res.json({error:"no se encontraron coincidencias"});
            });
    });
};

// retorna la lecturas del medidor de un usuario
var getMeassurement = function(serial, callback){
	var id = serial;
	mongoClient.connect(url, {server: {poolSize: 1}}, function(err, db){
		assert.equal(err, null, ["can't connect to db"]);
		modelo.abonados.getMeassurement(db, id, function(docs){
			db.close();
                        callback(docs);
		})
	});
}

// actualiza en la DB los parametros de lectura de un medidor
var updateMeassurement = function(data, callback){
    mongoClient.connect(url, {server: {pollSize : 2}}, function(err, db){
        assert.equal(err, null, ["can't connect to db"]);
        modelo.abonados.updateParameters(db, data, callback)
    }); 
}

// guarda y sumariza las medidciones por dia
var log = function(db, data, ref){

    //  retorna la fecha en formato estandar y en milisegundos sin considerar las horas 
    var date = function(){
	var _date = new Date();
	var _ano = _date.getFullYear();
	var _mes = _date.getMonth();
	var _dia = _date.getDate();
	return {
		standar: _date,
		today: function(){ return new Date(_ano, _mes, _dia).getTime(); },
	};
    };

    modelo.historial.entrada(db, data.parametros, ref, date().today(), function(){
        db.close();
    }); 
}

exports.report = report;
exports.form = form;
exports.search = search;
exports.register = register;
exports.getMeassurement = getMeassurement;
exports.updateMeassurement = updateMeassurement;
exports.log = log;
