(function(){
	var app = angular.module('Controllers', []);

	google.maps.event.addDomListener(window, 'load', function(){
		angular.bootstrap(document, ['teleApp']);
	});

	app.controller('MainController',["$mediciones","$timeout", function($mediciones,$timeout){
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

		this.markerOnMap = function(coordenandas){
			var LatLng = new google.maps
			.LatLng(coordenandas[1], coordenandas[0]);
			marker.setPosition(LatLng);
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
				mediciones.setInterval(5000);			
			});
		};

		// eventos al interactuar con el mapa
		google.maps.event.addListener(_map,'click', clickHandler);
		google.maps.event.addListener(self.circle, 'radius_changed', circleEventsHandler);
		google.maps.event.addListener(self.circle, 'center_changed', circleEventsHandler);
	}]);
})();
