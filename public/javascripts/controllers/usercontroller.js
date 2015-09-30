(function(){
	var app = angular.module('usercontroller', []);

	app.controller('userController', ['$mediciones', '$interval','$timeout', function($mediciones, $interval, $timeout){
		var $userid = angular.element('#NIS');
		console.log($userid);
		var self = this;
		var userid = $userid.html().match(/[a-zA-Z0-9]*$/)[0];
		var index = 0;
		var randonParam;
		var dynamicData =  function(){
			self.fadeIn = "fadeIn";
			self.key = randonParam[index];
			self.parametro = self.parametros[self.key];
			index++;
			if(index == 5)
				index = 0;
			$timeout(function(){
				self.fadeIn = "";
			},4200);
		}
		var result = function(data){
			self.parametros = data[0];
			randonParam = Object.keys(self.parametros);
			dynamicData();
		}
		var mediciones = $mediciones().abonado(userid, result);
		mediciones.getOne();
		mediciones.setInterval();
		var timeStop = $interval(function(){
			dynamicData();
		}, 5000);
	}]);
})();