(function(){
	var app = angular.module('minicardscontroller', []);
	
	app.controller('miniCardsController', ['$timeout', function($timeout){
		// logica de las mini tarjetas
		this.hidden = function(index){
			return this.card === index;
		};
		this.infoCard = function(index){
			if(this.card == index)
				return "completa";
			else
				return "minima"
		};
		this.extend = function(index){
			return this.card === index;
		};
		this.selectCard = function(index){
			$timeout(function(){
				self.card = -1;
			}, 60000);
			this.card = index;
		};
	}]);
})();
