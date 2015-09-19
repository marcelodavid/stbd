(function(){
	var app = angular.module('radio', []);

	app.directive('circleRadio', ['$timeout', function($timeout){
		return{
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel){
				ngModel.$render = function(){
					if(ngModel.$viewValue)
						element.val(ngModel.$viewValue);
				};

				ngModel.$commitViewValue = function(){
					console.log("commiting");
					if(ngModel.$viewValue){
						console.log(scope.mc.circle);
						$timeout(function(){
							scope.mc.circle.setRadius(+ngModel.$viewValue);
						});
					};
				}
			}
		};
	}])
})();
