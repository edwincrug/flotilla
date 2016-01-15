var documentoUrl = global_settings.urlCORS + '/api/documentoapi/';
var ruta = global_settings.uploadPath;
registrationModule.factory('documentoRepository', function ($http) {
    return {        
        saveFile: function (vin, idDocumento) {
            return $http.post(documentoUrl + '1|' + vin + '|'+ idDocumento + '|' + ruta);
        }
    };
});