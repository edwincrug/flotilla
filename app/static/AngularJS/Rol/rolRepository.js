var rolUrl = global_settings.urlCORS + '/api/rolapi/';

registrationModule.factory('rolRepository', function ($http) {
    return {
        getAll: function () {
            return $http.get(rolUrl + '1|0');
        }
    };
});