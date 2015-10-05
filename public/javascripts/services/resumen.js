(function(){
	/**
	* Resumen Module
	*
	* Description
	* Este servicio por medio de las operaciones de http
	* solicita la informacion que representa el resumen de un abonado como de las zonas en cuanto al consumo 
	* y demanada maxima a lo largo del tiempo, pasandole argumentos como los dias, meses y anos  
	* a partir de los cuales hara el resumen
	*/

	var app = angular.module('resumen',[]);

	app.factory('$resumen', ['$http', function($http){
		return function(dias, meses, anos){
			var _date = new Date();
			var _dia_actual = _date.getDate();
			var _mes_actual = _date.getMonth();
			var _ano_actual = _date.getFullYear();
			var _dias = dias? _dia_actual - dias : _dia_actual - 7;
			var _query_dias = function(){
				var _dias_ms = new Date(_ano_actual,_mes_actual,_dias).getTime();
				return _dias_ms;
			};
			var _query_meses = function(){
				var _meses_ms = [new Date(_ano_actual, _mes_actual, _dia_actual).getTime()];
				var limit = meses? _mes_actual - meses : 0;
				for (var i = _mes_actual; i > limit; i--){
					_meses_ms.push(new Date(_ano_actual, i, 0).getTime());
				}; 
				return _meses_ms;
			};
			var _query_anos = function(){
				var _anos_ms = [new Date(_ano_actual, _mes_actual, _dia_actual).getTime()];
				var limit = anos? _ano_actual - anos : _ano_actual - 4;
				for (var i = _ano_actual; i > limit; i--){
					_anos_ms.push(new Date(i -1, 12, 0).getTime());
				}; 
				return _anos_ms;
			};
			var _req1 = {
				method: 'GET'
			}

			return {
				abonado: {
					dias : function(id, callback){
						_req1.url = '/abonados/'+ id + '/resumen/dias?fecha='+ _query_dias();
						$http(_req1).success(function(data){
							callback(data);
						});
					}, 
					meses : function(id, callback){
						_req1.url = '/abonados/'+id + '/resumen/meses?fecha='+ _query_meses();
						$http(_req1).success(function(data){
							callback(data);
						});
					}, 
					anos : function(id, callback){
						_req1.url = '/abonados/'+id + '/resumen/anos?fecha='+ _query_anos();
						$http(_req1).success(function(data){
							callback(data);
						});
					}
				},
				zona: {
					dias : function(id, callback){
						_req1.url = '/zona/'+ id + '/resumen/dias?fecha='+ _query_dias();
						$http(_req1).success(function(data){
							callback(data);
						});
					}, 
					meses : function(id, callback){
						_req1.url = '/zona/' +id + '/resumen/meses?fecha='+ _query_meses();
						$http(_req1).success(function(data){
							callback(data);
						});
					}, 
					anos : function(id, callback){
						_req1.url = '/zona/' +id + '/resumen/anos?fecha='+ _query_anos();
						$http(_req1).success(function(data){
							callback(data);
						});
					}
				}
			};
		};
	}])
})();
