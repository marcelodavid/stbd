
var socket = io();
(function(){
    var app = angular.module('maincontroller', []);
    app.controller('mainController', ["$timeout","$zonas", "$abonados", function($timeout, $zonas, $abonados){ 
        var self = this;
        self.abonados = undefined;
        var _googleMap = document.getElementById("googleMap");
        if(_googleMap){
            var _image = '/images/map-marker-radius.png';
            var _options = {
                center:new google.maps.LatLng(-25.25463261974944, -57.513427734375),
                zoom:15,
                mapTypeId:google.maps.MapTypeId.TERRAIN
            };
            var _map = new google.maps.Map(_googleMap, _options)
            var marker = new google.maps.Marker({
                title: 'Location',
                map: _map,
                icon: _image,
                draggable: false
            });
            self.circle = new google.maps.Circle({
                map:_map,
                clickable: false,
                // metres
                radius: 500,
                fillColor: '#ffffff',
                fillOpacity: .6,
                strokeColor: '#3f51b5',
                strokeOpacity: .5,
                strokeWeight: 2,
                editable: true,
            });
        };
        var markerOnMap = function(coordenadas){
                var LatLng = new google.maps
                .LatLng(coordenadas[1], coordenadas[0]);
                marker.setPosition(LatLng);
        };
        this.active = function(){
                return true;
        };
        this.color = function(index){
                return "bcolor-" + (index % 4);
        };
        // above mostrara las coordenadas en el mapa al pasar el mouse
        // por la tarjeta o la fila de la tabla
        this.above = function(index, coordenadas){
                if (coordenadas && _googleMap)
                        markerOnMap(coordenadas);
                this.row = index;
        };
        this.info = function(index){
                return this.row === index;
        };
        // card title controll
        this.defaultIconName = function(){
                self.iconName = undefined;
        };
        this.hoverMore = function(){
                this.iconName = "Configurar";
        };
        this.hoverSave = function(){
                this.iconName = "Guardar...";
        };
        this.hoverEdit = function(){
                this.iconName = "Editar...";
        };
        this.hoverSend = function(status){
                status? this.iconName = "Enviar": this.iconName = "No todos los campos estan completos";
        };
        this.visibilityClass = "mdi-action-visibility"
        this.toggleVisibility = function(){
                this.visibility = !this.visibility;
                this.visibilityInfo = this.visibility? "Ocultar Detalles": "Mostrar Detalles";
                this.visibilityClass = this.visibility? "mdi-action-visibility-off": "mdi-action-visibility"
                return this.visibility;
        };
        this.valid = function(criteria){
                return criteria? "valid": "";
        };

/************ secondary-nav controll  ***********************/
        this.selectTab = function(index){
            this.tabSelected = index;
        };
        this.url = function(){
            var url = window.location.pathname.match(/mapa/);
            return url?true:undefined;
        };
        this.more = function(index){
                this.showClose = true;
        };
        this.showSave = true;
        this.saveValidate = function(){
            this.tabSelected = 1;
            return self.clickedMap;
        }
        this.close = function(){
                this.zonaUpdate? self.showEdit = true: self.showSave = true;
        };
        this.tabs = function(index){
                return index === this.tabSelected;
        };
        this.clickSubMenu = false;

        this.subMenu = function(){
            if(!this.tabContent){
                this.clickSubMenu = !this.clickSubMenu;
            }else{
                this.tabContent = false;
            }
        }
        this.subMenuActive = function(){
           return this.clickSubMenu;
        }
        // seccion: informacion de la zona
        self.altNombre  = "Sin identificacion";
        self.altDescripcion = "Esta zona no esta registrada";

        this.send = function(){
            var _zona = {
                    nombre: this.nombre,
                    descripcion: this.descripcion,
                    departamento: this.departamento,
                    ciudad: this.ciudad,
                    centro: [this.lng, this.lat],
                    radio: this.circle.radius,
                    portada: self.photoreference
            }
            if(this.zonaUpdate){
                    $zonas(_zona).update(this.updateParams);
            }
            else{
                    console.log("se guardan los datos de la zona");
                    $zonas(_zona).save(function(data){
                            self.updateParams = data;
                            self.zonaUpdate = true;
                            self.showSave = false;
                    });
            };
            self.showEdit= true;
            this.tabSelected = 0;
        };
        //buscar
        this.query = "";
        this.buscar = function(){
            $abonados().buscar(this.query, function(data){
                console.log(data);
            });
        };

        this.tabContent = false;
        this.tabsActive = function(){
            return this.tabContent;
        }
        
        // maneja el evento click sobre un enlace del submenu
        var $navLi = angular.element('.secondary-nav li');
        $navLi.on('click', function(){
            $timeout(function(){
                self.tabContent = !self.tabContent;
            });
        });
    
        /**************************************************************/
        socket.emit('admin', {});

        // datos y paginacion
        self.abonados = [];
        self.pagesize = 50;
        self.pagination = {
            current:1
        };
        self.pageChanged = function(newPage){
            socket.emit('area', {lat: self.lat, lng: self.lng, radio: self.circle.radius, page:newPage});   
        }

        var Serialtable;

        socket.on('pagina', function(abonados){
            Serialtable = {};
            console.log(abonados.docs.length);
            if(abonados.docs.length){

                // guarda en una tabla el valor del NIS y su posicion en el array
                abonados.docs.forEach(function(elem, index, array){
                    Serialtable[elem.serial] = index;   
                });

                // muestra la tabla al existir abonados en la zona
                $timeout(function(){
                    self.abonados = abonados.docs;
                    self.total = abonados.total;
                    self.showTable = true;
                }); 

            }
            else{
                self.showTable = false;
            }
        });

        // actualiza los datos del medidor que corresponde al NIS segun la tabla
        if(Serialtable){
            socket.on('update', function(abonado){
                $timeout(function(){
                    var index = Serialtable[abonado.data.serial];
                    if (index !== undefined){
                        self.abonados[index].parametros = abonado.data.parametros;
                    }
                });
            });
        }
        var service;

        // anexa una imagen de referencia a la zona
        var photoReference = function(place){
            var photos = place.photos;
            if(!photos){
                console.log('no find a photo');
                self.photoreference = "/images/unKnow.jpg"
                return;
            }

            self.photoreference = photos[0].getUrl({'maxWidth':500, 'maxHeight': 400});
        }

        
        // manejadores de eventos del mapa

        self.clickedMap = false;
        var clickHandler = function(event){ 
           $timeout(function(){ 
                self.clickedMap = true;
                self.tabSelected == 1? self.tabSelected = 2: null;
                self.lat = event.latLng.lat();
                self.lng = event.latLng.lng();

                // creamos un objeto LatLng para cambiar de centro
                self.LatLng = new google.maps.LatLng(self.lat, self.lng);
                self.circle.setCenter(self.LatLng);

                    var request ={
                    location: self.LatLng,
                    radius: '1000',
                    types: [
                        'airport',
                        'bus_station',
                        'cementery',
                        'hospital',
                        'police',
                        'university',
                        'pharmacy',
                        'church',
                        'park',
                        'bank',
                        'stadium',
                        'zoo',
                        'store',
                        'night_club'
                    ]
                }

                service = new google.maps.places.PlacesService(_map);
                service.nearbySearch(request, function(result, status){
                    if (status == google.maps.places.PlacesServiceStatus.OK){
                        photoReference(result[0]);
                    }
                });
            });
        };

        var circleEventsHandler = function(){
            // manejador que responde al cambio del centro como del radio
            $timeout(function(){

                // transmite al server los datos del area 
                self.pagination.current = 1;
                self.pageChanged(1);

                //resetea los campos del formulario zonas
                self.showSave = true;
                self.showEdit = false;
                self.nombre = undefined;
                self.descripcion = undefined;
                self.departamento = undefined;
                self.ciudad = undefined;
                self.zonaUpdate = false;
            });
        };

        // eventos al interactuar con el mapa
        if(_googleMap){
            google.maps.event.addListener(_map,'click', clickHandler);
            google.maps.event.addListener(self.circle, 'radius_changed', circleEventsHandler);
            google.maps.event.addListener(self.circle, 'center_changed', circleEventsHandler);
        }
    }]);
})();

