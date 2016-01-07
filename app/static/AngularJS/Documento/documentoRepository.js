var documentoUrl = global_settings.urlCORS + '/api/documentoapi/';



registrationModule.factory('documentoRepository', function ($http) {
    return {
        get: function (id) {
            return $http.get(documentoUrl + '0|' + id);
        },
        getByNodo: function (nodo, folio, perfil) {
            return $http.get(documentoUrl + '1|' + nodo + '|' + folio + '|' + perfil);
        },
        sendMail: function (idDocumento,folio,correo) {
            return $http({
                url: documentoUrl,
                method: "POST",
                params: { id: '2|' + idDocumento + '|' + folio + '|' + correo }
            });
        },
        saveDocument: function (folio, iddocumento, idperfil, idproceso, idnodo, idusuario, ruta) {
            return $http({
                url: documentoUrl,
                method: "POST",
                params: { id: '3|' + folio + '|' + iddocumento + '|' + idperfil + '|' + idproceso + '|' + idnodo + '|' + idusuario + '|' + ruta }
            });
        }
    };
});