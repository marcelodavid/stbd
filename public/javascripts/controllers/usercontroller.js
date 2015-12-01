(function(){
	var app = angular.module('usercontroller', []);

	app.controller('userController', ['$mediciones', '$interval','$timeout','$resumen', function($mediciones, $interval, $timeout, $resumen){
		var $userid = angular.element('#serial');
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
			},2200);
		};
		var result = function(data){
			self.parametros = data[0];
			randonParam = Object.keys(self.parametros);
			dynamicData();
		};
		var mediciones = $mediciones().abonado(userid, result);
		mediciones.getOne();
		mediciones.setInterval();
		var timeStop = $interval(function(){
			dynamicData();
		}, 3000);

		/* resumen y graficos */
		var options = {
			title: 'Potencias suministradas al domicilio',
			legend:{position: 'in'},
			height: 300,
			pointSize: 5,
			hAxis: {
	            format: 'MMM dd, yyyy',
	            gridlines: {color: 'none'},
          	},
          	vAxis: {
            	minValue: 0
          	},
          	curveType: 'function',
			colors: ['#c5e1a5']
		};
		var resumen_control =  function(data, id, column, key, options){
			var salida = function(clave, parametros){
				return clave=='fecha'? new Date(parametros[clave]): parseInt(parametros[clave]);
			};
			var campos = [[
				salida(clave, data[index]) for(clave in data[index]) if(clave == 'fecha' || clave == key) 
			] for(index in data)];
			
			// tabla1 contiene los resumenes diarios
			var tabla = new google.visualization.DataTable();
			tabla.addColumn('date', "Dias");
			tabla.addColumn('number', column);
			tabla.addRows(campos);

			var chart = new google.visualization.LineChart(angular.element(id)['0']);
			chart.draw(tabla, options);
		};

		//slider1 y el resumen de los dias
		var slider1 = document.getElementById('slider1');
		noUiSlider.create(slider1, {
			start:7,
			connect:'lower',
			step:1,
			range:{
				'min':2,
				'max':30
			}
		});

		slider1.noUiSlider.on('update', function(value, handle){
			$timeout(function(){
				self.slider1 = +value[handle].match(/[0-9]*/)[0];
				
				//servicio que trae los datos del historial
				$resumen(self.slider1).abonado.dias(userid, function(data){
					self.resumendias = data;
					resumen_control(self.resumendias, '#chart1', 'Potencia Activa', 'activatotal', options);
				});
			});
		});

		//slider2 y resumen de los ultimos meses
		var slider2 = document.getElementById('slider2');
		noUiSlider.create(slider2, {
			start:7,
			connect:'lower',
			step:1,
			range:{
				'min':2,
				'max':12
			}
		});

		slider2.noUiSlider.on('update', function(value, handle){
			$timeout(function(){
				self.slider2 = +value[handle].match(/[0-9]*/)[0];

				//servicio que trae los datos del historial
				$resumen(undefined, self.slider2).abonado.meses(userid, function(data){
					options.colors = ['#3f51b5'];
					self.resumenmeses = data;
					resumen_control(self.resumenmeses, '#chart2', 'Potencia Activa', 'activatotal',options, 'Pie');
				});
			});
		});

	}]);
})();
