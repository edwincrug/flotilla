﻿registrationModule.controller("busquedaController", function ($scope, $rootScope, localStorageService, alertFactory, busquedaRepository) {
    
    //Valores default
    $scope.factura = "";
    $scope.vin = "";

    //Grupo de funciones de inicio
    $scope.init = function () {

    };

    //Botón obtener la flotilla dependiendo de la factura o vin
    $scope.BuscarFlotilla = function(factura,vin){
        if(factura != null || vin != null)
        {
            busquedaRepository.getFlotilla(factura, vin)
            .success(getFlotillaSuccessCallback)
            .error(errorCallBack);
        } else
        {
            busquedaRepository.getFlotilla($scope.factura,$scope.vin)
            .success(getFlotillaSuccessCallback)
            .error(errorCallBack);
        }        
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