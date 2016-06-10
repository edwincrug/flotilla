var unidadUrl = global_settings.urlCORS + '/api/unidadapi/';

registrationModule.factory('unidadRepository', function ($http) {
    return {
        getUnidad: function (vin) {
            return $http.get(unidadUrl + '1|' + vin);
        },
        getFasePermiso: function (idUsuario) {
            return $http.get(unidadUrl + '2|' + idUsuario);
        },
        getDocFasePermiso: function (idUsuario, idFase) {
            return $http.get(unidadUrl + '3|' + idUsuario + '|'+ idFase);
        },
        getHeader: function (idUsuario, idFase) {
            return $http.get(unidadUrl + '4|' + idUsuario + '|'+ idFase);
        },
        insertUnidad: function(unidad){
            return $http.post(unidadUrl, unidad);
        },
        updateDocumento: function (vin, idDocumento, valor, idUsuario) {
            return $http({
                url: unidadUrl,
                method: "POST",
                params: { id: '1|' + vin + '|' + idDocumento + '|' + valor + '|' + idUsuario }
            });
        },
        updateLicitacionVIN: function (vin, idLicitacion, estatus){
            return $http.post(unidadUrl + '2|' + vin + '|'+ idLicitacion+ '|' +estatus);
        },
        deleteUnidadPropiedad: function (vin, idDocumento, valor){
            return $http({
                url: unidadUrl,
                method: "POST",
                params: { id: '3|' + vin + '|' + idDocumento + '|' + valor}
            });
        }
    };
});