(function(){
	var app = angular.module('Controllers', []);

	google.maps.event.addDomListener(window, 'load', function(){
		console.log("Arbol DOM construido");
		angular.bootstrap(document, ['teleApp']);
	});

	app.controller('MainController',["$mediciones","$timeout", function($mediciones,$timeout){
		var _counter = _counter || 0;
		var	_image = 'images/map-marker.png';

		this.options = {
			center:new google.maps.LatLng(-25.25463261974944, -57.513427734375),
			zoom:6,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};

		this.map = new google.maps.Map(document.getElementById("googleMap"),this.options);

		this.marker = new google.maps.Marker({
            title: 'Location',
            map: this.map,
            icon: _image,
            draggable: false
		});

		this.circle = null;

		this.markerOnMap = function(coordenandas){
			var LatLng = new google.maps
			.LatLng(coordenandas[1], coordenandas[0]);
			this.marker.setPosition(LatLng);
		};

		var self = this;
	    self.circle = new google.maps.Circle({
            map:self.map,
            clickable: false,
            // metres
            radius: 30000,
            fillColor: '#cfd8dc',
            fillOpacity: .6,
            strokeColor: '#3f51b5',
            strokeOpacity: .5,
            strokeWeight: 2,
            editable: true,
    	});

		google.maps.event.addListener(this.map,'click', function(event){
			_counter++;
			self.lat = event.latLng.lat();
			self.lng = event.latLng.lng();

			// creamos un objeto LatLng
			self.LatLng = new google
			.maps.LatLng(self.lat, self.lng);
			
	        self.circle.setCenter(
	        	self.LatLng
	        );
		});

		google.maps.event.addListener(self.circle,'radius_changed', function(){
			//resfull 
				$timeout(function(){
					null;
    			});
		});

		google.maps.event.addListener(self.circle,'center_changed', function(){
			//resfull 
				$timeout(function(){
					null;
    			});
		});
	}]);
})();
