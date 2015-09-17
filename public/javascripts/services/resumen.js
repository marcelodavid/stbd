(function(){
	/**
	* Resumen Module
	*
	* Description
	* Este servicio por medio de las operaciones de http
	* envia la informacion para realizar el resumen de un abonado  y las zonas en cuanto al consumo 
	* y demanada maxima a lo largo del tiempo pasandole una fecha especifica
	*  
	*/

	var app = angular.module('resumen',[]);

	app.factory('$resumen', ['$http', function($http){
		return function(fecha){
			var _req1 = {
				method: 'GET'
			}
			return {
				abonado: function(name, id){
					_req1.url = '/abonados/'+name + '/resumen?id='+ id + '&fecha='+ fecha;
					$http(_req1).success(function(data){
						callback(data);
					});	
				},
				zona: function(name, id){
					_req1.url ='/zona/' + name + '/resumen?id='+ id + '&fecha='+ fecha;
					$http(_req1).success(function(data){
						callback(data);
					});						
				}
			}
		};
	}])
})();
