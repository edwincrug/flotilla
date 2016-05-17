registrationModule.controller("headerController", function ($scope, $rootScope, localStorageService, alertFactory) {

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Obtengo los datos del empleado loguado
        $scope.empleado = localStorageService.get('employeeLogged');
    };

    $scope.Salir = function() {
        localStorageService.set('employeeLogged', null); 
        localStorageService.set('busqueda', null);
        location.href = '/';
    };

});