var reporteUrl = global_settings.urlCORS + '/api/reporteApi/';

registrationModule.factory('reporteRepository', function ($http) {
    return {
        get: function (fechaInicio, fechaFinal) {
            return $http({
                url: reporteUrl,
                method: "GET",
                params: { id: '1|' + fechaInicio + '|' + fechaFinal }
            });
        },
        getDetalle: function (idSincronizacion) {
            return $http({
                url: reporteUrl,
                method: "GET",
                params: { id: '2|' + idSincronizacion }
            });
        },
        getReporte: function (idCliente) {
            return $http({
                url: reporteUrl,
                method: "GET",
                params: { id: '3|' + idCliente }
            });
        },
        getCliente: function () {
            return $http({
                url: reporteUrl,
                method: "GET",
                params: { id: '4|' }
            });
        }
        
    };
});