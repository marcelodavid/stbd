(function(){
    let app = angular.module('UserRegister', []);

    app.directive('userReg', ['$abonados', '$timeout', function($abonados, $timeout){
        return {
            restrict: 'E',
            templateUrl: '../../templates/register.html',
            require:'mainController',
            controller: function(){
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
            },
            controllerAs: 'user',
        }
    }]);
})();
