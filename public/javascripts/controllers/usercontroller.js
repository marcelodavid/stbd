(function(){
	var app = angular.module('usercontroller', []);

	app.controller('userController', ['$interval','$timeout','$resumen', function($interval, $timeout, $resumen){
            let $userid = angular.element('#serial');
            let $select1 = angular.element("#selecthour1");
            let $select2 = angular.element("#selecthour2");
            var self = this;
            var userid = $userid.html().match(/[a-zA-Z0-9]*$/)[0]; 
            
            // inicializamos los valores de energia activa, para el consumo por hora
            // elimina el efecto del registro acumulativo
            self.Kwh = {consumo:[]};

            // inicializamos la lista de consumo
            self.Kw = {consumo:[]};

            self.userDataLoad = function(parametros){
                energyConsumption(self.Kw, parametros, 'Energia Activa').normal();
                energyConsumption(self.Kw, parametros, 'Energia Activa').fixed(self.Kwh);

                // reajustamos la scala maxValue
                self.option1.vAxis.viewWindow.max = parseFloat(parametros['Energia Activa']) + 100;

                // redibujamos el chart del consumo diario
                drawLine(self.Kw.consumo, '#Kw', 'kwh',self.option1, 'datetime').classic();

                // redibujamos el chart del consumo con el registro acumulativo
                drawLine(self.Kwh.consumo,'#I1', 'kw',self.option3, 'datetime').classic();
            };

            // actualizamos los datos con socket io
            // formamos parate del espacio admin
            socket.emit('usuario',{'userid':userid});
            
            // al in)ciar la pagina se carga la ultima lectura hecha por el medidor
            socket.on('ultimaLectura', function(user){
                var parametros = user.data.parametros;
                $timeout(function(){
                    self.parametros = parametros;
                    self.option1.vAxis.viewWindow.min = parseFloat(self.parametros['Energia Activa']) - 100;
                    self.seeChart = true;
                    self.userDataLoad(parametros);
                });
            });
            
            // se actualiza la lectura
            socket.on('update', function(user){
                var parametros = user.data.parametros;
                if (user.data.serial == userid){
                    $timeout(function(){
                        self.seeChart = true;
                        self.parametros = parametros;
                    });
                   self.userDataLoad(parametros);
                }
            });

        /*****************************************************************************
         *                      resumen y graficos                                   *
         *****************************************************************************/
            self.date = new Date();
            self.minView = new Date(self.date.getFullYear(), self.date.getMonth(), self.date.getDate());
            self.maxView = new Date(self.minView.getFullYear(), self.minView.getMonth(), self.minView.getDate(), 23, 59);

            // opcion1 is for current chart
            // Energia Activa
            self.option1 = {
                title: 'Ultimas lecturas de Energia Activa en kwh',
                legend:{position: 'in'},
                height: 300,
                pointSize: 4,
                chartArea:{
                    width:'90%',
                },
                hAxis: {
                    viewWindow: {
                        min: self.minView,
                        max: self.maxView
                    },
                    gridlines: {
                        count:-1,
                        units:{
                            days: {format:['MM dd']},
                            hours:{format:['HH:mm']},
                        }
                    },
                    minorGridlines: {
                        units: {
                          hours: {format: ['hh:mm:ss', 'ha']},
                          minutes: {format: ['HH:mm a', ':mm']}
                        }
                    }
                },
                vAxis: {
                    viewWindowMode:'explicit',
                    viewWindow:{
                        min:0,
                        max:10000
                    },
                    textPosition:'in',
                    format:'decimal',
                },
                colors: ['#757575']
            };

            self.option3 = {
                title: 'Ultimas lecturas de Potencia consumida en kw',
                legend:{position: 'in'},
                height: 300,
                pointSize: 4,
                chartArea:{
                    width:'90%',
                },
                hAxis: {
                    viewWindow: {
                        min: self.minView,
                        max: self.maxView
                    },
                    gridlines: {
                        count:-1,
                        units:{
                            days: {format:['MM dd']},
                            hours:{format:['HH:mm']},
                        }
                    },
                    minorGridlines: {
                        units: {
                          hours: {format: ['hh:mm:ss', 'ha']},
                          minutes: {format: ['HH:mm a', ':mm']}
                        }
                    }
                },
                vAxis: {
                    viewWindowMode:'pretty',
                    textPosition:'in',
                    format:'decimal',
                },
                colors: ['#757575']
            };

            // options is for energy consuption
            self.option2 = {
                title:'Energia consumida en Kwh',
                legend:{position:"none"},
                chart:{
                    title: 'Energia consumida por dia',
                    subtitle: 'Energia Activa', 
                },
                height: 300,
                pointSize: 5,
                hAxis:{
                    format:'MMM dd',
                    gridlines:{
                        color: 'none'
                    }
                },
                vAxis: { 
                    minValue: 0,
                    format:'decimal',
                },
                colors: ['#009688'],
                bars:'vertical',
                bar: {groupWidth: "70%"}
            }; 
               
            var parseAcumulativeForChart = function(data, key, header){
                /*
                 *  Esta funcion parsea los datos en forma 
                 *  array para la funcion de google que
                 *  se encarga del dibujo
                 *  Parse los datos que han sido acumulados diariamente
                 */

                var campos = [];

                // el header se usa para los charts tipo bar
                if(header){
                    campos.push(header);
                }
                data.map(function(parametros, index, array){
                        if(index){
                            var abscisas = new Date(parametros.fecha);

                            // ordenadas contiene el valor acumulado a partir del dia anterior [index -1]
                            var ordenadas = parseFloat(parametros.resumen[key]) - parseFloat(array[index - 1].resumen[key]);
                            ordenadas *= 1000;
                            campos.push([abscisas, ordenadas]);
                        }
                });

                return campos;                  
            }

            var energyConsumption = function(array, data, key){
                /*
                 *  almacena en el array las ultimas
                 *  50 lecturas del consumo de energia 
                 *  hechas
                 */
                let date = new Date (data['fecha']);
                return {
                    normal: function(){
                        if (array.consumo.length >= 100)
                            array.consumo.shift();
                        array.consumo.push([date, parseFloat(data[key])]);
                    },
                    fixed: function(newArray){

                        // get length of the consumption array
                        let length = array.consumo.length;
                        if (newArray.consumo.length >= 100)
                            newArray.consumo.shitf();
                        if(length > 1){
                            let deltaKwh = parseFloat(data[key]) - array.consumo[length - 2][1];
                            newArray.consumo.push([date, deltaKwh]);
                        }
                    }
                }
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

            // renderizamos un chart tipo bar
            var drawBar = function(campos, idDOM,options){
                var tabla = google.visualization.arrayToDataTable(campos);
                var chart = new google.charts.Bar(angular.element(idDOM)['0']);
                chart.draw(tabla, options);
            }

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
            
            var campos_dias;
            self.seeChart1 = false;
            slider1.noUiSlider.on('update', function(value, handle){
                    $timeout(function(){
                            self.slider1 = +value[handle].match(/[0-9]*/)[0];
                            
                            //servicio que trae los datos del historial
                            $resumen(self.slider1).abonado.dias(userid, function(data){
                                if(data.length > 1){
                                    self.seeChart1 = true;
                                    self.resumendias = data;
                                    campos_dias = parseAcumulativeForChart(self.resumendias,'Energia Activa', ['dias', 'Consumo']);
                                    drawBar(campos_dias, '#chart1', self.option2);
                                }else
                                    self.seeChart1 = false;
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
            
            var campos_meses;
            self.seeChart2 = false; // this is for bar chart
            slider2.noUiSlider.on('update', function(value, handle){
                    $timeout(function(){
                            self.slider2 = +value[handle].match(/[0-9]*/)[0];

                            //servicio que trae los datos del historial
                            $resumen(undefined, self.slider2).abonado.meses(userid, function(data){
                                if(data.length > 1){
                                    self.seeChart2 = true;
                                    self.resumenmeses = data;
                                    campos_meses = parseAcumulativeForChart(self.resumenmeses,'Energia Activa', ['Mes', 'Consumo']);
                                    drawBar(campos_meses, '#chart2',self.option2);
                                }else
                                    self.seeChart2 = false;
                            });
                    });
            });

            let redrawChart = function(){
                // redibujamos el chart del consumo con diferencia
                drawLine(self.Kwh.consumo,'#I1', 'kwh',self.option3, 'datetime').classic();

                // redibujamos el chart del consumo del registro acumulativo
                drawLine(self.Kw.consumo, '#Kw', 'kwh', self.option1, 'datetime').classic();
                
                // redibujamos los chart del consumo en dias y meses
                if(campos_dias && campos_meses){
                    drawBar(campos_dias, '#chart1', self.option2);
                    drawBar(campos_meses, '#chart2',self.option2);
                }
            }

            // redraw all charts when page is resizing
            window.addEventListener('resize', redrawChart);

            // modificamos el rango de vista de los charts
            $select1.on('change', function(){
                self.minView.setHours($select1.val());
                self.option1.hAxis.viewWindow.min = self.minView;
                redrawChart();
            });

            $select2.on('change', function(){
                self.maxView.setHours($select2.val());
                self.option1.hAxis.viewWindow.max = self.maxView;
                redrawChart();
            });
    }]);
})();
