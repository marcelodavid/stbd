(function(){
	var app = angular.module('usercontroller2', []);

	app.controller('userController2', ['$abonados','$timeout', function($abonados, $timeout){
		
		// modelo del formulario que enrolara a los clientes
		this.NIS ="";
		this.Nombre = "";
		this.Email = "";
		this.Direccion= "";
		this.Coordenadas ="";
		this.CI ="";
		this.RUC = "";
		this.Telefono = "";
		this.Equipo = "";
		this.lat = "";
		this.lng = "";

		this.addUser = function(){
			var form = {
				"NIS": this.NIS,
				"nombre": this.Nombre,
				"ci": this.CI,
				"mail": this.Email,
				"direccion": this.Direccion,
				"localidad": {
					"type": "Point",
					"coordinates": [+this.lng, +this.lat],
				},
				"ruc": this.RUC,
				"Telefono": this.Telefono,
				"serial": this.Equipo,
			};
			$abonados(form).add(function(){
				console.log("exitoso");
                                form = {};
			});
		};
		var self = this;
		var getCurrentPosition = function(){
			if(navigator.geolocation){
				navigator.geolocation.watchPosition(function(position){
					$timeout(function(){
						self.lat = position.coords.latitude;
						self.lng = position.coords.longitude;

						//mostramos el resultado en el mapa
						var latlon = self.lat + "," + self.lng;
						self.map_url = "http://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false";
					});
				});
			} else{
				console.log("geolocalizacion no soportada por el browser");
			};
		};
		window.onload =  function(){
			getCurrentPosition();
		};
	}]);
})();
