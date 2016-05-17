var registrationModule = angular.module("registrationModule", ["ngRoute", "ngGrid", "cgBusy", "ngAnimate", "ui.bootstrap", "LocalStorageModule", "mobiscroll-form"])
.config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: '/AngularJS/Templates/Login.html',
        controller: 'loginController'
    });

    $routeProvider.when('/unidad', {
        templateUrl: '/AngularJS/Templates/Nodo.html',
        controller: 'nodoController'
    });

    $routeProvider.when('/busqueda', {
        templateUrl: '/AngularJS/Templates/Busqueda.html',
        controller: 'busquedaController'
    });

    $routeProvider.when('/activacion', {
        templateUrl: '/AngularJS/Templates/Activacion.html',
        controller: 'activacionController'
    });

    $locationProvider.html5Mode(true);
});

registrationModule.run(function ($rootScope) {
    $rootScope.empleado = "";
    $rootScope.cliente = "";
})

registrationModule.directive('resize', function ($window) {
	return function (scope, element) {
		var w = angular.element($window);
        var changeHeight = function() {element.css('height', (w.height() -20) + 'px' );};  
			w.bind('resize', function () {        
		      changeHeight();   // when window size gets changed          	 
		});  
        changeHeight(); // when page loads          
	}
});
