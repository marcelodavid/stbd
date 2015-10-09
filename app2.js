var event= require('events').EventEmitter;
var ee = new event(); 
var mongoClient = require('mongodb').MongoClient;
var url ='mongodb://localhost:27017/data';
var assert = require('assert');
var http =  require('http').Server();
var io = require('socket.io')(http);

var modelo = require('./model/model');

var bitacora = function(){
	var _time = new Date();
	var _ano = _time.getFullYear();
	var _mes = _time.getMonth();
	var _dia = _time.getDate();
	return {
		time: _time,
		get: function(){ return new Date(_ano, _mes, _dia).getTime(); },
	};
};

io.on('connection', function(client){
	console.log("conexion establecida con el cliente");

	client.on('parametros', function(data){
		data.parametros.fecha = bitacora().time.toLocaleFormat();
		mongoClient.connect(url, {server:{poolSize:1}}, function(err, db){
			assert.equal(err, null, ["can't connect to db"]);
			modelo.abonados.actualizar_medicion(db, data, function(referencia){
				var fecha = bitacora().get();
				modelo.historial.entrada(db, data, referencia, fecha, function(){
					db.close();
				});
			})
		});
	});
});

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
		modelo.abonados.area(db, lat, lng, radio, function(docs){
			var resumen = {
				activo_zona : 0,
				demanda_maxima : 0,
			}; 
			for(abonado of docs){
				resumen.activo_zona += parseFloat(abonado["parametros"]["Energia Activa"]);
				resumen.demanda_maxima += parseFloat(abonado["parametros"]["Demanda Maxima"]);
			};

			modelo.historial.entrada(db, resumen, zona[index]._id, fecha, function(){
				index++;
				ee.emit('resumen', zona, index, db);
			});
		});
	}; 
});

module.exports = http;
