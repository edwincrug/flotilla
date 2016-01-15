var loginUrl = global_settings.urlCORS + '/api/usuarioapi/';

registrationModule.factory('loginRepository', function ($http) {
    return {
        add: function (rol, nombre, email, password) {
            // return $http.post(loginUrl + '1|' + rol + '|' + nombre + '|' + email + '|' + password);
            return $http({
                url: loginUrl,
                method: "POST",
                params: { id: '1|' + rol + '|' + nombre + '|' + email + '|' + password }
            });
        },

        login: function (usuario, password) {
            // return $http.put(loginUrl + '1|' + usuario + '|' + password);
            return $http({
                url: loginUrl,
                method: "POST",
                params: { id: '3|' + usuario + '|' + password }
            });
        }
    };
});