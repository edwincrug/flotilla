var searchUrl = global_settings.urlCORS + '/api/filtroApi/';

registrationModule.factory('searchRepository', function ($http) {
    return {
        get: function (id) {
            return $http.get(searchUrl + '1|' + id);
        },
        getDivision: function () {
            return $http.get(searchUrl + '1');
        },
        getEmpresa: function (idempleado) {
            return $http.get(searchUrl + '2|' + idempleado);
        },
        getSucursal: function (idempleado, idempresa) {
            return $http.get(searchUrl + '3|' + idempleado + '|' + idempresa);
        },
        getDepartamento: function (idempleado, idempresa, idsucursal) {
            return $http.get(searchUrl + '4|' + idempleado + '|' + idempresa + '|' + idsucursal);
        },
        getTipos: function () {
            return $http.get(searchUrl + '6|0');
        },
        getProveedor: function (cadena) {
            return $http.get(searchUrl + '5|' + cadena);
        },
        getFolios: function (id) {
            return $http.get(searchUrl + '7|' + id);
        },
        update: function (id) {
            return $http.post(searchUrl + '2|' + id);
        }
    };
});