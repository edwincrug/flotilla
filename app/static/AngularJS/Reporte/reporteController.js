registrationModule.controller("reporteController", function ($scope, $rootScope, localStorageService, alertFactory, reporteRepository, busquedaRepository) {

    $scope.Init = function () {
        //alertFactory.info('Cargué!');
    }

    $scope.buscaSincronizacion = function (fechaInicio, fechaFinal) {
        $('#btnBuscar').button('loading');
        if (fechaInicio === undefined || fechaInicio === '') {
            alertFactory.warning('La fecha inicial es un campo obligatorio');
            $('#btnBuscar').button('reset');
        } else if (fechaFinal === undefined || fechaFinal === '') {
            alertFactory.warning('La fecha final es un campo obligatorio');
            $('#btnBuscar').button('reset');
        } else if (Date.parse(fechaFinal) < Date.parse(fechaInicio)) {
            alertFactory.warning('La fecha final no puede ser menor a la fecha de inicio');
            $('#btnBuscar').button('reset');
        } else {
            reporteRepository.get(convertDate(fechaInicio), convertDate(fechaFinal))
                .success(getSincronizacionSuccessCallback)
                .error(errorCallBack);
        }
    }

    var getSincronizacionSuccessCallback = function (data, status, headers, config) {
        $('#btnBuscar').button('reset');
        if (data.length > 0) {
            $scope.listaSincronizacion = data;
        } else {
            alertFactory.info('No se encontro información con los criterios de búsqueda');
            $('#btnBuscar').button('reset');
        }

        /* $rootScope.listaUnidades = data;
         localStorageService.set('factura', $scope.factura);
         localStorageService.set('vin', $scope.vin);
         localStorageService.set('busqueda', data);*/
        alertFactory.success('Datos de flotillas cargados.');
    };

    var errorCallBack = function (data, status, headers, config) {
        alertFactory.info('No se encontro información con los criterios de búsqueda');
        $('#btnBuscar').button('reset');
    };

    function convertDate(inputDate) {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }
        var d = new Date(inputDate);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    }

    $scope.mostrar = function (idSincronizacion) {
        reporteRepository.getDetalle(idSincronizacion)
            .success(getDetalleSuccessCallback)
            .error(errorDetalle);
    }

    var getDetalleSuccessCallback = function (data, status, headers, config) {
        if (data.length > 0) {
            $scope.listaDetalle = data;

            $scope.groups = _.groupBy($scope.listaDetalle, "vin");
            $('#myModal').modal('show');
        }
    };

    var errorDetalle = function (data, status, headers, config) {
        alertFactory.info('No se pudo obtener la información');
    };

    $scope.Detalle = function (vin) {
        busquedaRepository.getFlotilla('', vin)
            .success(getFlotillaSuccessCallback)
            .error(errorCallBack);
    };

    var getFlotillaSuccessCallback = function (data, status, headers, config) {
        localStorageService.set('factura', data[0].factura);
        localStorageService.set('vin', data[0].vin);
        localStorageService.set('busqueda', data);
        localStorageService.set('currentVIN', data[0]);
        location.href = '/unidad';
    };

    var errorCallBack = function (data, status, headers, config) {
        alertFactory.info('');
    };

});