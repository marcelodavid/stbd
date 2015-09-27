(function(){
	var app = angular.module('navcontroller', []);

	app.controller('navController', function(){
		var _url = window.location.pathname.match(/\/.+?\/|\//);
		this.visited = function(index){
			return this.link === index;
		};
		switch (_url[0]){
			case "/mapa/":
				this.color = "bcolor-1";
				this.link = 2;
				this.image = "/images/mapa.svg";
				this.hidden = true;
				break;
			case "/zonas/":
				this.color = "bcolor-2";
				this.link = 3;
				this.image = "/images/location.svg";
				break;
			case "/abonados/":
				this.color = "bcolor-3";
				this.link = 4;
				this.image = "/images/abonado.svg";
				break;
			default:
				this.color = "bcolor-0";
				this.link = 1;
				this.image = "/images/home.svg";
				this.hidden = true;
		};
	});
})();
