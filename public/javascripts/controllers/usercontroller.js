(function(){
	var app = angular.module('usercontroller', []);

	app.controller('userController', ['$interval','$timeout','$resumen', function($interval, $timeout, $resumen){
            var $userid = angular.element('#serial');
            var self = this;
            var userid = $userid.html().match(/[a-zA-Z0-9]*$/)[0]; 
            
            // inicializamos los valores de las corrientes de linea
            var I1 = {corrientes:[]};
            var I2 = {corrientes:[]};
            var I3 = {corrientes:[]};

            var userDataLoad = function(parametros){
                    lastDataForCurrentChart(I1, parametros, 'Corriente L1');
                    lastDataForCurrentChart(I2, parametros, 'Corriente L2');
                    lastDataForCurrentChart(I3, parametros, 'Corriente L3');

                    // redibujamos las lines de corriente
                    drawLine(I1.corrientes,'#I1', 'Linea 1',option1, 'datetime').classic();
                    drawLine(I2.corrientes,'#I2', 'Linea 2',option1, 'datetime').classic();
                    drawLine(I3.corrientes,'#I3', 'Linea 3',option1, 'datetime').classic();
            }

            // actualizamos los datos con socket io
            // formamos parate del espacio admin
            socket.emit('usuario',{'userid':userid});
            
            // al in)ciar la pagina se carga la ultima lectura hecha por el medidor
            socket.on('ultimaLectura', function(user){
                var parametros = user.data.parametros;
                $timeout(function(){
                    self.parametros = parametros; 
                    self.seeChart = true;
                })
                userDataLoad(parametros);
            });
            
            // se actualiza la lectura
            socket.on('update', function(user){
                var parametros = user.data.parametros;
                if (user.data.serial == userid){
                    $timeout(function(){
                        self.seeChart = true;
                        self.parametros = parametros;
                    });
                    userDataLoad(parametros);
                }
            });

        /*****************************************************************************
         *                      resumen y graficos                                   *
         *****************************************************************************/
            // opcion1 is for current chart
            var option1 = {
                title: 'Corriente de Linea [A]',
                legend:{position: 'in'},
                height: 300,
                pointSize: 4,
                chartArea:{
                    width:'95%',
                    left:-100
                },
                hAxis: {
                    gridlines: {
                        color:'none',
                        count:-1,
                        units:{
                            days: {format:['MM dd']},
                            hours:{format:['HH:mm']},
                        }
                    },
                },
                vAxis: {
                    textPosition:'in',
                    format:'decimal',
                    minValue: 0
                },
                curveType: 'function',
                colors: ['#757575']
            };

            // options is for energy consuption
            var option2 = {
                title:'Potencia suministrada al domicilio',
                legend:{position:'none'},
                height: 300,
                pointSize: 5,
                hAxis:{
                    format:'MMM dd, yyyy',
                    gridlines:{
                        color: 'none'
                    }
                },
                vAxis: {
                    minValue: 0
                },
                curveType: 'function',
                colors: ['#c5e1a5']
            }

               
            var parseAcumulativeForChart = function(data, key){
                /*
                 *  Esta funcion pasea los datos en forma 
                 *  array para la funcion de google que
                 *  se encarga del dibujo
                 *  Parse los datos que han sido acumulados diariamente
                 */
                    var campos = [];
                    data.map(function(parametros, index, array){
                            if(index){
                                var abscisas = new Date(parametros.fecha);

                                // ordenadas contiene el valor acumulado a partir del dia anterior [index -1]
                                var ordenadas = parseInt(parametros.resumen[key]) - parseInt(array[index - 1].resumen[key]);
                                campos.push([abscisas, ordenadas]);
                            }
                    });
                    return campos;                  
            }

            var lastDataForCurrentChart = function(array, data, key){
                /*
                 *  Esta funcion retorna un array
                 *  con la hora y las lecturas de las
                 *  corrientes de linea.
                 *  Mantiene actualizado los ultimos diez 
                 *  valores medidos
                 */
                if(array.corrientes.length >= 10)
                    array.corrientes.shift();
                array.corrientes.push([new Date (data['fecha']), parseFloat(data[key])]);                
            }

            // inicializa los campos de la columna del chart
            var drawLine =  function(campos ,idDOM, columnLabel, options, type){
                    if(!type){
                        type = 'date';
                    }
                    var tabla = new google.visualization.DataTable();
                    tabla.addColumn(type, "periodo");
                    tabla.addColumn('number', columnLabel);
                    tabla.addRows(campos);

                    return {
                        classic:function(){
                            var chart = new google.visualization.LineChart(angular.element(idDOM)['0']);
                            chart.draw(tabla, options);
                        },
                        material: function(){        
                            var chart = new google.charts.Line(angular.element(idDOM)['0']);
                            chart.draw(tabla, options);
                        }
                    }
            };

            //slider1 y el resumen de los dias
            var slider1 = document.getElementById('slider1');
            var slider1_options = {
                    start:7,
                    connect:'lower',
                    step:1,
                    range:{
                            'min':2,
                            'max':30
                    }
            }
            noUiSlider.create(slider1,slider1_options);
            slider1.noUiSlider.on('update', function(value, handle){
                    $timeout(function(){
                            self.slider1 = +value[handle].match(/[0-9]*/)[0];
                            
                            //servicio que trae los datos del historial
                            $resumen(self.slider1).abonado.dias(userid, function(data){
                                    self.resumendias = data;
                                    option2.colors = ['#c5e1a5'];
                                    var campos = parseAcumulativeForChart(self.resumendias,'Energia Activa');
                                    drawLine(campos, '#chart1', 'Energia Activai en Kwh', option2).classic();
                            });
                    });
            });

            //slider2 y resumen de los ultimos meses
            var slider2_options = {
                    start:7,
                    connect:'lower',
                    step:1,
                    range:{
                            'min':2,
                            'max':12
                    }
                }

            var slider2 = document.getElementById('slider2');
            noUiSlider.create(slider2, slider2_options);

            slider2.noUiSlider.on('update', function(value, handle){
                    $timeout(function(){
                            self.slider2 = +value[handle].match(/[0-9]*/)[0];

                            //servicio que trae los datos del historial
                            $resumen(undefined, self.slider2).abonado.meses(userid, function(data){
                                    option2.colors = ['#3f51b5'];
                                    self.resumenmeses = data;
                                    var campos = parseAcumulativeForChart(self.resumenmeses,'activatotal');
                                    drawLine(campos, '#chart2', 'Potencia Activa en Kwh',option2).classic();
                            });
                    });
            });
    }]);
})();
