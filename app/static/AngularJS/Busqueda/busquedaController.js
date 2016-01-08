registrationModule.controller("busquedaController", function ($scope, $rootScope, localStorageService, alertFactory, busquedaRepository) {

    //Grupo de funciones de inicio
    $scope.init = function () {

    };

    //Botón obtener la flotilla dependiendo de la factura o vin
    $scope.buscarFlotilla = function(factura,vin){
        busquedaRepository.getFlotilla(factura,vin)
            .success(getFlotillaSuccessCallback)
            .error(errorCallBack);
    };

    //Succes obtiene lista de objetos de las flotillas
    var getFlotillaSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaFlotillas = data;
        alertFactory.success('Datos de flotillas cargados.');
    };
    
    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        alertFactory.error('No se encuentran flotillas con los datos de busqueda: ' + data);
    };

});