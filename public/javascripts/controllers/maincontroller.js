(function(){
	var app = angular.module('Controllers', []);

	app.controller('MainController',["$mediciones","$timeout","$zonas", function($mediciones,$timeout,$zonas){
		var	_image = 'images/map-marker.png';

		var _options = {
			center:new google.maps.LatLng(-25.25463261974944, -57.513427734375),
			zoom:7,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};

		var _map = new google.maps.Map(document.getElementById("googleMap"), _options);

		var marker = new google.maps.Marker({
            title: 'Location',
            map: _map,
            //icon: _image,
            draggable: false
		});

		this.markerOnMap = function(coordenadas){
			var LatLng = new google.maps
			.LatLng(coordenadas[1], coordenadas[0]);
			marker.setPosition(LatLng);
		};

		this.above = function(index, coordenadas){
			if (coordenadas)
				this.markerOnMap(coordenadas);
			this.row = index;
		};

		this.info = function(index){
			return this.row === index;
		};

		this.active = function(){
			return true;
		}

		// logica de las mini tarjetas
		this.selectCard = function(index){
			this.card = index;
		};

		this.extend = function(index){
			return this.card === index;
		};

		this.hidden = function(index){
			return this.card === index;
		};

		this.infoCard = function(index){
			if(this.card == index)
				return "completa";
			else
				return "minima"
		};

		this.color = function(index){
			return "color-" + (index % 4);
		};

		
		var self = this;
	    self.circle = new google.maps.Circle({
            map:_map,
            clickable: false,
            // metres
            radius: 30000,
            fillColor: '#ffffff',
            fillOpacity: .6,
            strokeColor: '#3f51b5',
            strokeOpacity: .5,
            strokeWeight: 2,
            editable: true,
    	});

	    // manejadores de eventos del mapa
	    var clickHandler = function(event){
			self.lat = event.latLng.lat();
			self.lng = event.latLng.lng();

			// creamos un objeto LatLng para cambiar de centro
			self.LatLng = new google.maps.LatLng(self.lat, self.lng);
	        self.circle.setCenter(self.LatLng);
	        // se muestra la tabla el clickear el mapa
		};

		var mediciones; 	// el servicio que nos traera los datos de la DB
		var result = function(docs){
			// aqui se cargan los datos personales y parametros de cada abonado
			self.abonados = docs;
		};

		var circleEventsHandler = function(){
			$timeout(function(){
				mediciones? mediciones.clearInterval(): null;
				mediciones = $mediciones(self.circle.radius, self.lat, self.lng, result);
				mediciones.getOne();
				mediciones.setInterval(300000);			
			});
		};

		// eventos al interactuar con el mapa
		google.maps.event.addListener(_map,'click', clickHandler);
		google.maps.event.addListener(self.circle, 'radius_changed', circleEventsHandler);
		google.maps.event.addListener(self.circle, 'center_changed', circleEventsHandler);
	}]);
})();
