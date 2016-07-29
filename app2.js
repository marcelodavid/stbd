var event= require('events').EventEmitter;
var ee = new event(); 
var mongoClient = require('mongodb').MongoClient;
var url ='mongodb://localhost:27017/data';
var assert = require('assert');
var http =  require('http').Server();

var modelo = require('./model/model');


// ejecuta el manejador una vez al dia
setInterval(function(){
	var horas = new Date().getHours();
	var minutos= new Date().getMinutes();
	if (horas===23 && minutos===55){
		mongoClient.connect(url,{server: {poolSize:1}},function(err,db){
			assert.equal(err,null);
			ee.emit('buscar',db);
		});
	}; 
}, 60000);

ee.on('buscar', function(db){
	modelo.zonas.buscar(db, function(docs){
		var index = 0;
		ee.emit('resumen',docs,index,db);
	});
});

ee.on('resumen', function(zona, index, db){
	if(zona[index] === undefined){
		db.close();
	}
	else{
		var fecha = bitacora().get();
		var lat = zona[index].centro[1];
		var lng = zona[index].centro[0];
		var radio = zona[index].radio;
		modelo.abonados.area(db, lat, lng, radio, 0, function(docs){
			var resumen = {
				activo_zona : 0,
				demanda_maxima : 0,
			}; 
                        // mapea los objetos extraidos para el resumen
                        docs.forEach(function(abonado){
			    resumen.activo_zona += parseFloat(abonado["parametros"]["Energia Activa"]);
			    resumen.demanda_maxima += parseFloat(abonado["parametros"]["Demanda Maxima"]);
                        });

			modelo.historial.entrada(db, resumen, zona[index]._id, fecha, function(){
				index++;
				ee.emit('resumen', zona, index, db);
			});
		});
	}; 
});

module.exports = http;

