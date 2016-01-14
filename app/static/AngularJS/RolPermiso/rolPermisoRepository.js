var rolPermisoUrl = global_settings.urlCORS + '/api/rolpermisoapi/';

registrationModule.factory('rolPermisoRepository', function ($http) {
    return {
        getRolPermiso: function (idRol) {
            return $http.get(rolPermisoUrl + '1|' + idRol);
        }        
    };
});