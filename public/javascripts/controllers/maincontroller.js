(function(){
	var app = angular.module('maincontroller', []);
	app.controller('mainController', ["$mediciones","$timeout","$zonas", "$abonados", function($mediciones, $timeout, $zonas, $abonados){
        var	_image = '/images/map-marker-radius.png';
		var _options = {
			center:new google.maps.LatLng(-25.25463261974944, -57.513427734375),
			zoom:12,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};
        var self = this;
        var _googleMap = document.getElementById("googleMap");
        if(_googleMap){
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
                radius: 3000,
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
    	this.hoverClose = function(){
    		this.iconName = "Cerrar";
    	};
    	this.visibilityInfo = "Mostrar Detalles";
    	this.visibilityClass = "mdi-action-visibility"
    	this.hoverVisibility = function(){
    		this.iconName = this.visibilityInfo;
    	};
    	this.toggleVisibility = function(){
    		this.visibility = !this.visibility;
    		this.visibilityInfo = this.visibility? "Ocultar Detalles": "Mostrar Detalles";
    		this.visibilityClass = this.visibility? "mdi-action-visibility-off": "mdi-action-visibility"
    		return this.visibility;
    	};
    	this.valid = function(criteria){
    		return criteria? "valid": "";
    	};
        // secondary-nav controll
    	this.clickSave = function(index){
    		this.tabSelected = index;
    		self.showSave = false;
    		self.showSend = true;
    		self.showClose = true;
    	};
    	this.clickEdit = function(index){
    		this.tabSelected = index;
    		self.showEdit = false;
    		self.showSend = true;
    		self.showClose = true;
    	};
    	this.clickMore = function(index){
    		this.tabSelected = index;
    		this.showClose = true;
    	};
    	this.clickClose = function(){
    		this.tabSelected = 0;
    		this.showClose = false;
    		this.showSend = false;
    		this.zonaUpdate? self.showEdit = true: self.showSave = true;
    	};
    	this.tabs = function(index){
    		return index === this.tabSelected;
    	};
    	// seccion: informacion de la zona
    	self.altNombre  = "Mi zona de Estudio";
    	self.altDescripcion = "Esta zona no esta registrada";
    	this.send = function(){
    		var _zona = {
    			nombre: this.nombre,
    			descripcion: this.descripcion,
    			departamento: this.departamento,
    			centro: [this.lat, this.lng],
    			radio: this.circle.radius,
    		}
    		if(this.zonaUpdate){
    			$zonas(_zona).update(this.updateParams);
    		}
    		else{
    			$zonas(_zona).save(function(data){
    				self.updateParams = data;
    				self.zonaUpdate = true;
    			});
    		};
    		self.showSend= false;
    		self.showEdit= true;
    		this.showClose = false;
    		this.tabSelected = 0;
    	};
        //buscar
        this.query = "";
        self.abonados = [];
        this.buscar = function(){
            $abonados().buscar(this.query, function(data){
                console.log(data);
            });
        };
	    // manejadores de eventos del mapa
	    var clickHandler = function(event){
			self.lat = event.latLng.lat();
			self.lng = event.latLng.lng();

			// creamos un objeto LatLng para cambiar de centro
			self.LatLng = new google.maps.LatLng(self.lat, self.lng);
	        self.circle.setCenter(self.LatLng);
	        // se muestra la tabla y las opciones al clickear el mapa
	        self.showTable = true;
	        self.showOthers = true;
		};
		var mediciones; 	// el servicio que nos traera los datos de la DB
		var result = function(docs){
			// aqui se cargan los datos personales y parametros de cada abonado
			// que seran mostradas en la tabla
			self.abonados = docs;
		};
		var circleEventsHandler = function(){
			// manejador que responde al cambio del centro como del radio
			$timeout(function(){
				mediciones? mediciones.clearInterval(): null;
				mediciones = $mediciones().mapa(self.circle.radius, self.lat, self.lng, result);
				mediciones.getOne();
				mediciones.setInterval(3000);
                //reseteamos los campos del formulario para guardar zonas y sus opciones
                //de navegacion
				self.showSave = true;
				self.showSend = false;
				self.showEdit = false;
				self.showClose = false;
				self.tabSelected == 2? self.tabSelected = undefined: null;
				self.nombre = undefined;
				self.descripcion = undefined;
				self.departamento = undefined;
				self.zonaUpdate = false;
			});
		};
		// eventos al interactuar con el mapa
        if(_googleMap){
            google.maps.event.addListener(_map,'click', clickHandler);
            google.maps.event.addListener(self.circle, 'radius_changed', circleEventsHandler);
            google.maps.event.addListener(self.circle, 'center_changed', circleEventsHandler);
        }

        //manejar el evento scroll
        window.onload  = function(){
            $timeout(function(){
                var $scroll = angular.element('#mCSB_1_container');
                var $header = angular.element('#header');
                $scroll.on("wheel", function(event){
                    if(event.originalEvent.deltaY > 0){
                        $scroll.hasClass('mCS_no_scrollbar_y') ? undefined: $header.addClass('shadow');
                    }else if(parseInt($scroll.css("top")) > -5){
                        $header.removeClass('shadow');
                    }
                });
            });
        };

	}]);
})();
