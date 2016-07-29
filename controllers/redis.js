var redis = require('redis');
var cache = redis.createClient();

cache.on('error', function(err){
    console.log("Error " + err);
});

var free = function(client){
    // limpiamos la cache del admin ante un cambio de area 
    cache.smembers(client.id, function(err, reply){
    // cambio de pag o de area 
        if(reply){
            reply.forEach(function(elem){
                cache.del(elem);
            });
            cache.del(client.id);
        } 
    });
}

var stick = function(cliente_id, medidor_serial){
    cache.sadd([cliente_id, medidor_serial]); 
    cache.sadd([ medidor_serial,cliente_id]); // O(1)
}

var savedSerial = function(Medidor_serial, callback){
    console.log(Medidor_serial);
    cache.exists(Medidor_serial, function(err, reply){
        callback(reply);
    });
}

exports.free = free;
exports.stick = stick;
exports.savedSerial = savedSerial;

