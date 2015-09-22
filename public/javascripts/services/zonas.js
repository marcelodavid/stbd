(function(){
	/**
	* Zonas Module
	*
	* Description
	* Este servicio por medio de las operaciones de http
	* envia la informacion para asociar atributos a una zona
	* puesta bajo estudio. Tambien solicita todas las zonas
	* guardadas en la base de datos
	*  
	*/
	var app = angular.module('zonas',[]);

	app.factory('$zonas',['$http',function($http){
		return function(form){
			var _req1 = form? {
				method: 'POST',
				url: '/zona/nueva',
				data: form,
				headers: {
		        	'Content-Type': 'application/json'
		    	}
			}: undefined;
			var _req2 = {
				method: 'GET',
				url: '/zona/todas'
			};
			var _req3 = {
				method: 'PUT',
				url:'/zona/',
				data: form,
				headers: {
					'Content-Type': 'application/json'
				}
			};			
			return {
				save: function(callback){
					$http(_req1).success(function(data){
						callback(data);
					});					
				},
				update: function(params){
					_req3.url += params;
					$http(_req3);
				},
				all: function(callback){
					$http(_req2).success(function(data){
						callback(data);
					});	
				},
				name: function(name, callback){
					_req2.url = '/zona/'+name;
					$http(_req2).success(function(data){
						callback(data);
					});	
				}
			}
		};
	}]);
})();
