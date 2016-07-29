(function(){
	var app = angular.module('usercontroller', []);

	app.controller('userController', ['$interval','$timeout','$resumen', function($interval, $timeout, $resumen){
		var $userid = angular.element('#serial');
		var self = this;
		var userid = $userid.html().match(/[a-zA-Z0-9]*$/)[0];
                
                // actualizamos los datos con socket io
                // formamos parate del espacio admin

		socket.emit('usuario',{'userid':userid});

                // al iniciar la pagina se carga la ultima lectura hecha por el medidor
                socket.on('ultimaLectura', function(user){
                    $timeout(function(){
                        self.parametros = user.data.parametros; 
                    });
                });
                
                // se actualiza la lectura
                socket.on('update', function(user){
                    if(user.data.serial ==  userid){
                        $timeout(function(){
                            self.parametros = user.data.parametros; 
                        });
                    }
                });

        /*****************************************************************************
         *                      resumen y graficos                                   *
         *****************************************************************************/
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

                // inicializa los campos de la columna del chart
		var resumen_control =  function(data, idDOM, columnLabel, key, options){
			var campos = [];
			data.map(function(parametros, index, array){
                                if(index){
                                    var abscisas = new Date(parametros.fecha);

                                    // ordenadas contiene el valor acumulado a partir del dia anterior [index -1]
                                    var ordenadas = parseInt(array[index - 1].resumen[key]) - parseInt(parametros.resumen[key]);
                                    campos.push([abscisas, ordenadas]);
                                }
			});
			
			var tabla = new google.visualization.DataTable();
			tabla.addColumn('date', "Dias");
			tabla.addColumn('number', columnLabel);
			tabla.addRows(campos);

			var chart = new google.visualization.LineChart(angular.element(idDOM)['0']);
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
					resumen_control(self.resumendias, '#chart1', 'Energia Activai en Kwh', 'Energia Activa', options);
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
					resumen_control(self.resumenmeses, '#chart2', 'Potencia Activa en Kwh', 'activatotal',options, 'Pie');
				});
			});
		});

	}]);
})();
