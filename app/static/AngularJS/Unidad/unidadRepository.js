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
        insertUnidad: function(unidad){
            return $http.post(unidadUrl + '1|', unidad);
        },
        updatetUnidad: function(unidad){
            return $http.put(unidadUrl + '1|', unidad);
        }
    };
});