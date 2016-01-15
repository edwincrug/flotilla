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
        insertDocumento: function (vin, idDocumento , valor) {
            return $http.post(unidadUrl + '1|' + vin + '|'+ idDocumento + '|' + valor);
        },
        updateDocumento: function (vin, idDocumento , valor) {
            return $http.post(unidadUrl + '2|' + vin + '|'+ idDocumento + '|' + valor);
        },
        getExisteDocumento: function (vin, idDocumento){
            return $http.get(unidadUrl + '3|' + vin + '|' +idDocumento);
        }

    };
});