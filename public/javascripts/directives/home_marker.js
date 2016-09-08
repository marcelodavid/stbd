(function(){
    let app = angular.module('homeMarker', []);

    app.directive('homePoint', ['$timeout', function($timeout){
        return{
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel){
                
                /*
                 *  Get actual position and add 
                 *  a marker to use for user register
                 */
                var showHomeMarker = function(lat, lng){
                    scope.user.lat = lat;
		    scope.user.lng = lng;
                    scope.mc.LatLng = new google.maps.LatLng(scope.user.lat, scope.user.lng);
                    scope.mc.registerMarker.setPosition(scope.mc.LatLng);

                }
                var getCurrentPosition = function(){
		    if(navigator.geolocation){
		        navigator.geolocation.watchPosition(function(position){
			    $timeout(function(){
                                showHomeMarker(position.coords.latitude, position.coords.longitude);
                            });
		        });
		    } else{
			console.log("geolocalizacion no soportada por el browser");
		    };
		};
		
                window.onload =  function(){
			getCurrentPosition();
		};

                /*
                 *  Listen drag event for marker
                 *  then render the value in template
                 */
                
                google.maps.event.addListener(scope.mc.registerMarker, 'dragend', function(mouseEvent){
                   $timeout(function(){
                       showHomeMarker(mouseEvent.latLng.lat(), mouseEvent.latLng.lng());
                   });
                });
                
                // watch variables changes
                ngModel.$render = function(){
                    element.val(ngModel.$viewValue);
                }

                ngModel.$commitViewValue = function(){
                    if(attrs.coord == "latitud")
                        scope.mc.LatLng = new google.maps.LatLng(ngModel.$viewValue, scope.user.lng);
                    else
                        scope.mc.LatLng = new google.maps.LatLng(scope.user.lat, ngModel.$viewValue);
                    $timeout(function(){
                        scope.mc.registerMarker.setPosition(scope.mc.LatLng);
                    });
                };
            }
        }
    }]);
})();
