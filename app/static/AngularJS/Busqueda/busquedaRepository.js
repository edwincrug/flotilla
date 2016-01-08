var searchUrl = global_settings.urlCORS + '/api/usuarioApi/';

registrationModule.factory('busquedaRepository', function ($http) {
    return {
        getFlotilla: function (factura, vin) {
            return $http.get(searchUrl + '1|' + factura + vin);
        }
    };
});