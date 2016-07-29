// instancia los modulos 
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

// importa las rutas
var index = require('./routes/index');
var mapa = require('./routes/mapa');
var abonados = require('./routes/abonados');
var zonas = require('./routes/zonas');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// instala los middlewares de uso general
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// instala las rutas
app.use('/', index);
app.use('/mapa', mapa);
app.use('/zona', zonas);
app.use('/abonados', abonados);

// importa redis para usarlo como cache
var cache = require('./controllers/redis');

// importa los controladores mapa y abonados
var mapCtrl = require('./controllers/mapa');
var userCtrl = require('./controllers/abonados');

// real time web con socket.io
io.on('connection', function(client){
    // une a todos los administradores en una room
    client.on('admin', function(){
        client.join('admin');
    });
    
    client.on('area', function(area){
        // libera espacio en memoria
        cache.free(client);

        // request a todos los medidores de la zona 
	mapCtrl.area(area, function(docs, total){
            
            // retorna hasta un maximo de 50
            client.emit('pagina', {'total':total, 'docs':docs});

            // guarda el serial de los medidores en cache
            docs.forEach(function(doc, index, array ){
                if(doc){
                    cache.stick(client.id, doc.serial);
                }
            });
        });
    });

    client.on('usuario', function(medidor){
        // libera espacio en memoria
        cache.free(client);
                        
        // una vez conectado se envia la ultima lectura registrada
        userCtrl.getMeassurement(medidor.userid, function(docs){
            client.emit('ultimaLectura',{'data':docs[0]}); 
        });

        // guarda el NIS del usuario final en cache
        cache.stick(client.id, medidor.userid); 
    });

    client.on('parametros', function(data){
        // reenvia los datos al admin
        if (data.serial){
            cache.savedSerial(data.serial, function(exists){
                if(exists){
                        client.to('admin').emit('update',{'data':data}); 
                }
            });
        }
        // guarda en una DB persistente
        userCtrl.updateMeassurement(data, function(db, ref){

            /* ref crea una relacion normalizada con la
             * coleccion resumen
             */
            userCtrl.log(db, data, ref);
        });
    });

    client.on('disconnect', function(){

        // libera espacio en memoria
        cache.free(client);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = server;

