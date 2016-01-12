registrationModule.controller("busquedaController", function ($scope, $rootScope, localStorageService, alertFactory, busquedaRepository) {
    
    //Valores default
    $scope.factura = '';
    $scope.vin = '';

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Obtengo los datos del empleado loguado
        $rootScope.empleado = localStorageService.get('employeeLogged');
    };

    //Botón obtener la flotilla dependiendo de la factura o vin
    $scope.BuscarFlotilla = function(factura,vin){
        $('#btnBuscar').button('loading');
        if(factura == '' && vin == '')
        {
            alertFactory.warning('Seleccione al menos un criterio de búsqueda');
        }
        else if(factura != '' || vin != '')
        {
            busquedaRepository.getFlotilla(factura, vin)
            .success(getFlotillaSuccessCallback)
            .error(errorCallBack);
        } 
        else
        {
            busquedaRepository.getFlotilla($scope.factura,$scope.vin)
            .success(getFlotillaSuccessCallback)
            .error(errorCallBack);
        }
        //regreso el objeto a su estado original
        $('#btnBuscar').button('reset');        
    };

    //Succes obtiene lista de objetos de las flotillas
    var getFlotillaSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaUnidades = data;
        alertFactory.success('Datos de flotillas cargados.');
    };
    
    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        alertFactory.info('No se encuentran flotillas con los criterios de búsqueda: ' + data);
    };

    $scope.EnviarUnidad = function(uni){
        localStorageService.set('currentVIN', uni);
        location.href = '/unidad';
    }
});