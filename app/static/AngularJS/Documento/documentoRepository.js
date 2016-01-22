var documentoUrl = global_settings.urlCORS + '/api/documentoApi/';
var ruta = global_settings.uploadPath;

registrationModule.factory('documentoRepository', function ($http) {
    return {        
        saveFile: function (vin, idDocumento, name) {
        	return $http({
                url: documentoUrl,
                method: "POST",
                params: { id: '1|' + vin + '|' + idDocumento + '|' + ruta + name }
            });
        }
    };
});