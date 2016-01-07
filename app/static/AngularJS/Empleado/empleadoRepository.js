var empleadoUrl = global_settings.urlCORS + '/api/empleadoApi/';

registrationModule.factory('empleadoRepository', function ($http) {
    return {
        get: function (id) {
            return $http.get(empleadoUrl + '1|' + id);
        },
        update: function (id) {
            return $http.post(empleadoUrl + '2|' + id);
        }
    };
});