registrationModule.controller("busquedaController", function ($scope, $rootScope, localStorageService, alertFactory, busquedaRepository) {
    
    //Valores default
    $scope.factura = '';
    $scope.vin = '';

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Obtengo los datos del empleado logueado
        $rootScope.empleado = localStorageService.get('employeeLogged');
        //Se valida si existe una busqueda previa
        if(localStorageService.get('busqueda') != null)
        {
            $scope.factura2 = localStorageService.get('factura');
            $scope.vin2 = localStorageService.get('vin');
            if(localStorageService.get('factura') == null){
                $scope.factura2 = '';
            }
            if(localStorageService.get('vin') == null){
                $scope.vin2 = '';    
            }
            //Se realiza la busqueda con los parametros iniciales
            busquedaRepository.getFlotilla($scope.factura2, $scope.vin2)
                .success(getFlotillaSuccessCallback)
                .error(errorCallBack);
            //Se asigna el valor de la busqueda
            $('#txtVIN').val($scope.vin2);
            $('#txtFactura').val($scope.factura2);
        }
    };
    
    //Botón obtener la flotilla dependiendo de la factura o vin
    $scope.BuscarFlotilla = function(factura,vin){
        $('#btnBuscar').button('loading');
		if(factura == null){
			factura = '';
		}
		if(vin == null){
			vin = '';
		}
        var datoFactura = $("#txtFactura").val();
        var datoVin = $("#txtVIN").val();
        factura = datoFactura;
        vin = datoVin;

        if(factura == '' && vin == '')
        {
            alertFactory.warning('Seleccione al menos un criterio de búsqueda');
            //regreso el objeto a su estado original
            $('#btnBuscar').button('reset');
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
    };

    //Succes obtiene lista de objetos de las flotillas
    var getFlotillaSuccessCallback = function (data, status, headers, config) {
        //regreso el objeto a su estado original
        $('#btnBuscar').button('reset');  
        $rootScope.listaUnidades = data;
        localStorageService.set('factura', $scope.factura);
        localStorageService.set('vin', $scope.vin);
        localStorageService.set('busqueda', data);
        alertFactory.success('Datos de flotillas cargados.');
    };
    
    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        alertFactory.info('No se encuentran flotillas con los criterios de búsqueda');
    };

    $scope.EnviarUnidad = function(uni){
        localStorageService.set('currentVIN', uni);
        location.href = '/unidad';
    }
});