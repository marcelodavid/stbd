(function () {
	var app = angular.module('centro', []);

	app.directive('latLng',[ '$timeout',function($timeout){
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel){
				ngModel.$render = function(){
					if(ngModel.$viewValue)
						element.val(ngModel.$viewValue);
				};

				ngModel.$commitViewValue = function(){
					if(ngModel.$viewValue){
						if(attrs.coord == "latitud")
							scope.mc.LatLng = new google.maps.LatLng(ngModel.$viewValue, scope.mc.lng);
						else
							scope.mc.LatLng = new google.maps.LatLng(scope.mc.lat, ngModel.$viewValue);
						$timeout(function(){
							scope.mc.circle.setCenter(scope.mc.LatLng);
						});
					};
				};
			}
		};
	}]);
})();
