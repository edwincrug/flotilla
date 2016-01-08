registrationModule.controller("loginController", function ($scope, $rootScope, localStorageService, alertFactory, nodoRepository) {

    //Propiedades
    $scope.isLoading = false;
    $scope.idProceso = 1;
    $scope.perfil = 1;

    //Deshabilitamos el clic derecho en toda la aplicación
    //window.frames.document.oncontextmenu = function(){ alertFactory.error('Función deshabilitada en digitalización.'); return false; };

    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Obtengo los datos del empleado loguado
        // empleadoRepository.get(getParameterByName('employee'))
        //     .success(getEmpleadoSuccessCallback)
        //     .error(errorCallBack);
    };

  

});
