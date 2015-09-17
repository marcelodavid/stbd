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
		return function(form, callback){
			var _req1 = {
				method: 'POST',
				url: '/zona',
				data: form,
				headers: {
		        	'Content-Type': 'application/json'
		    	}
			};
			var _req2 = {
				method: 'GET',
				url: '/zona/todas'
			};			
			return {
				save: function(){
					$http(_req1).success(function(data){
						callback(data);
					});					
				},
				all: function(){
					$http(_req2).success(function(data){
						callback(data);
					});	
				},
				name: function(name){
					_req2.url = '/zona/'+name;
					$http(_req2).success(function(data){
						callback(data);
					});	
				}

			}

		};
	}]);
})();
