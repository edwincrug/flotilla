var rolPermisoUrl = global_settings.urlCORS + '/api/nodoapi/';

registrationModule.factory('rolPermisoRepository', function ($http) {
    return {
        getRolPermiso: function (idRol, vin) {
            return $http.get(rolPermisoUrl + '1|' + idRol + '|' + vin);
        }        
    };
});