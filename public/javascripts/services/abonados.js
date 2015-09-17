(function(){
	/**
	* Abonado Module
	*
	* Description
	* Este servicio por medio de las operaciones de http
	* envia la informacion para registrar un abonado y tambien 
	* permite buscar un abonado especifico, por medio del nombre, el C.I., el NIS.
	*  
	*/
	var app = angular.module('abonados',[]);

	app.factory('$abonados', ['$http', function($http){
		return function(form,callback){
			var _req1 = {
				method: 'GET'
			};
			var _req2 = {
				method: 'POST',
				url: '/abonados/nuevo',
				data: form,
				headers: {
		        	'Content-Type': 'application/json'
		    	}
			};
			return {
				buscar: function(generico){
					_req1.url = '/abonados/'+'?generico='+generico;
					$http(_req1).success(function(data){
						callback(data);
					});	
				},

				add: function(){
					$http(_req2).success(function(data){
						callback(data);
					});
				}
			};
		};
	}])
})();
