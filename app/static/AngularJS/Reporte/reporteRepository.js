var reporteUrl = global_settings.urlCORS + '/api/reporteApi/';

registrationModule.factory('reporteRepository', function ($http) {
    return {
        get: function () {
            return $http.get(reporteUrl + '1|' );
        }
    };
});