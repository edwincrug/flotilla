registrationModule.controller("activacionController", function ($scope, $rootScope, localStorageService, alertFactory, activacionRepository) {

    //Propiedades
    $scope.isLoading = false;
    $scope.idProceso = 1;
    $scope.perfil = 1;

    //Deshabilitamos el clic derecho en toda la aplicación
    //window.frames.document.oncontextmenu = function(){ alertFactory.error('Función deshabilitada en digitalización.'); return false; };

    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Activo la cuenta
        activacionRepository.activar(getParameterByName('id'))
            .success(validarSuccessCallback)
            .error(errorCallBack);
    };

    var validarSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Cuenta activada correctamente');
    };

  

});