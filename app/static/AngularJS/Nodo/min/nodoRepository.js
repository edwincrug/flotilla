var nodoUrl = global_settings.urlCORS + '/api/nodoapi/';

registrationModule.factory('nodoRepository', function ($http) {
    return {
        get: function (id) {
            return $http.get(nodoUrl + '0|' + id);
        },
        getAll: function (folio,idproceso, perfil) {
            return $http.get(nodoUrl + '1|' + folio + '|' + idproceso + '|' + perfil);
        },
        getHeader: function (folio, usuario) {
            return $http.get(nodoUrl + '2|' + folio + '|' + usuario);
        },
        update: function (id) {
            return $http.post(nodoUrl + '2|' + id);
        }
    };
});