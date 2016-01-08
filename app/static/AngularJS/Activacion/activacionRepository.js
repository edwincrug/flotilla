var activacionUrl = global_settings.urlCORS + '/api/usuarioapi/';

registrationModule.factory('activacionRepository', function ($http) {
    return {
        activar: function (usuario) {
            return $http.post(activacionUrl + '2|' + usuario);
        }
    };
});