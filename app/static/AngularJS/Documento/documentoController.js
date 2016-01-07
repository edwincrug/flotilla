registrationModule.controller("documentoController", function ($scope, $rootScope, localStorageService, alertFactory, documentoRepository) {

    //Propiedades
    //Desconfiguramos el clic izquierdo en el frame contenedor de documento
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Métodos
    $scope.VerDocumento = function(doc) {
        if(doc.consultar == 1){
            //Muestra Documento
            var pdf_link = doc.Ruta;
            var titulo = doc.folio + ' :: ' + doc.descripcion;
            //var iframe = '<div id="hideFullContent"><div id="hideFullMenu"> </div><iframe id="ifDocument" src="' + pdf_link + '" frameborder="0"></iframe> </div>';
            var iframe = '<div id="hideFullContent"><div id="hideFullMenu" onclick="nodisponible()" ng-controller="documentoController"> </div> <object id="ifDocument" data="' + pdf_link + '" type="application/pdf" width="100%" height="100%"><p>Alternative text - include a link <a href="' + pdf_link + '">to the PDF!</a></p></object> </div>';
            $.createModal({
                title: titulo,
                message: iframe,
                closeButton: false,
                scrollable: false
            }); 

        }
        else{
            alertFactory.warning('Acción no permitida para su perfil.');
        }
        
    };

    $scope.NoDisponible = function() {
        alertFactory.error('Función deshabilitada en digitalización.');
    };

    ///////////////////////////////////////////////////////////////////////////////////
    ///Envío de documentos

    $scope.ShowEnviar = function(doc) {
        if(doc.enviarEmail == 1){
           $('#modalSend').modal('show');
           $rootScope.currentDocument = doc;
        }
        else{
            alertFactory.warning('Acción no permitida para su perfil.');
        }
    };

    var enviarDocumentoSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Documento enviado correctamente.');
        $('#btnEnviar').button('reset');
        $('#modalSend').modal('hide');
    }

    $scope.EnviarDocumento = function() {
        if($rootScope.currentDocument.consultar == 1){
        $('#btnEnviar').button('loading');
           documentoRepository.sendMail($rootScope.currentDocument.idDocumento, $rootScope.currentDocument.folio,$scope.correoDestinatario)
            .success(enviarDocumentoSuccessCallback)
            .error(errorCallBack);
        }
        else{
            alertFactory.warning('Acción no permitida para su perfil.');
        }
    };

    //////////////////////////////////////////////////////////////////////////
    /// Carga de documentos

    $scope.ShowCargar = function(doc) {
        $('#frameUpload').attr('src', '/uploader')
        $('#modalUpload').modal('show');
        $rootScope.currentUpload = doc;
    };

    var uploadSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Documento cargado');
    };

    $scope.CargarDocumento = function(){
        documentoRepository.uploadFile($("#fileDoc")[0].files[0])
            .success(uploadSuccessCallback)
            .error(errorCallBack);
    };

    $scope.FinishUpload = function(name){
        alertFactory.success('Cool ' + name);
        var doc = $rootScope.currentUpload;
       // documentoRepository.saveDocument(doc.folio, doc.idDocumento, 1, 1, doc.idNodo, 1, global_settings.uploadPath + name)
         //   .success(saveDocumentSuccessCallback)
           // .error(errorCallBack);
    };

    var saveDocumentSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Cool');
    }


});