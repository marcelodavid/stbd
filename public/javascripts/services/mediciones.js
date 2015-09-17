(function() {
	/**
	* Mediciones Module
	*
	* Description
	* Obtiene los datos personales y los parametros electricos
	* del abonado mediante el servicio $http. La solicitud se
	* limita a los puntos dentro de la  cia de radio 'radio' y
	* de centro c(lat, lng). El resultado se exporta como 
	* argumento de la funcion anonima introducida como 4to 
	* parametro. 
	*/
	var app = angular.module('mediciones',[]);

	app.factory('$mediciones', ['$http', function($http){
		return function(radio, lat, lng, callback){
				var _temp;
				var _req = {
				 method: 'GET',
				 url: '/mapa/mediciones?radio='+radio
					+'&lat='+lat+'&lng='+lng,
				};
				return {
					getOne: function(){
						$http(_req).success(function(docs){
							callback(docs);
						});

					},
					setInterval: function(arg){
						var time = arg || 60000;
						_temp = setInterval(this.getOne,time);
					},	
					clearInterval: function(){
						clearInterval(_temp);
					},
				};
			};	
	}]);
})();
