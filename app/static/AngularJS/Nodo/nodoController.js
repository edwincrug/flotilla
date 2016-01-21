registrationModule.controller("nodoController", function ($scope, $rootScope, localStorageService, alertFactory, nodoRepository, unidadRepository, documentoRepository) {

    //Propiedades
    $scope.idProceso = 1;
    $scope.perfil = 1;
    $scope.idRol = 20;
    $scope.idFase = 1;
    $scope.currentDocId = 0;
    $scope.listaDocumentos = null;
    $scope.modificado = null;
    $scope.url = null;
    $scope.frente = null;
    $scope.costadoDer = null;
    $scope.costadoIzq = null;
    $scope.trasera = null;

    //Deshabilitamos el clic derecho en toda la aplicación
    //window.frames.document.oncontextmenu = function(){ alertFactory.error('Función deshabilitada en digitalización.'); return false; };

    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Obtengo los datos del empleado logueado
        $scope.empleado = localStorageService.get('employeeLogged');
        //Obtengo el idUsuario
        $scope.idUsuario =  $scope.empleado.idUsuario;
        $scope.idRol = $scope.empleado.idRol;
        localStorageService.set('idUsuario',$scope.idUsuario);
        localStorageService.set('idRol', $scope.idRol);
        //Obtengo los datos del VIN
        $scope.unidad = localStorageService.get('currentVIN');

        unidadRepository.getHeader($scope.unidad.vin)
            .success(obtieneHeaderSuccessCallback)
            .error(errorCallBack);

        getListaDocumentos();

        $('#placaDoc').hide(); 
        $('[data-toggle="popover"]').popover()

        //Se cargan las imagenes de autos
        if(localStorageService.get('frente') != null)
        {
            url = global_settings.downloadPath + localStorageService.get('vin') + '/' + localStorageService.get('frente');
            $('#fotoFrente').attr("src",url);    
        } 
        if(localStorageService.get('trasera') != null)
        {
            url = global_settings.downloadPath + localStorageService.get('vin') + '/' + localStorageService.get('trasera');
            $('#fotoTrasera').attr("src",url); 
        } 
        if(localStorageService.get('costadoIzq') != null)
        {
            url = global_settings.downloadPath + localStorageService.get('vin') + '/' + localStorageService.get('costadoIzq');
             $('#fotoIzquierda').attr("src",url); 
        }
        if(localStorageService.get('costadoDer') != null)
        {
            url = global_settings.downloadPath + localStorageService.get('vin') + '/' + localStorageService.get('costadoDer');
            $('#fotoDerecha').attr("src",url); 
        }
    };

    /////////////////////
    ///Header
    ////////////////////

    var obtieneHeaderSuccessCallback = function (data, status, headers, config) {
       $scope.unidadHeader = data;
       $scope.valVin = $scope.unidadHeader.vin;
       //Obtengo los datos del empleado logueado
       localStorageService.set('vin', $scope.valVin);
       
       $scope.currentPage = $scope.unidadHeader.faseActual;
      
       //Obtengo la lista de fases
       nodoRepository.getFasePermiso($scope.empleado.idRol)
                .success(obtieneNodosSuccessCallback)
                .error(errorCallBack);      
    };

    var getListaDocumentos = function(){
        nodoRepository.getRolPermiso(localStorageService.get('idRol'), localStorageService.get('vin'))
            .success(obtieneRolPermisoSuccesCallback)
            .error(errorCallBack); 
    }

    var obtieneRolPermisoSuccesCallback = function(data, status, headers, config){
        //if($scope.listaDocumentos == null){
            $scope.listaDocumentos = data;
            var idDoc = $scope.listaDocumentos[24].idDocumento;
            $scope.frente = $scope.listaDocumentos[26].valor;
            $scope.costadoDer = $scope.listaDocumentos[29].valor;
            $scope.costadoIzq = $scope.listaDocumentos[28].valor;
            $scope.trasera = $scope.listaDocumentos[27].valor;
            localStorageService.set('frente',$scope.frente);
            localStorageService.set('costadoDer',$scope.costadoDer);
            localStorageService.set('costadoIzq',$scope.costadoIzq);
            localStorageService.set('trasera',$scope.trasera);
        //}
        /*else{
            $scope.modificado = data;        
        }*/
        
    };

    //Abre una orden padre o hijo
    $scope.VerOrdenPadre = function(exp){
        location.href = '/?id=' + exp.folioPadre + '&employee=1';
    };

    $scope.VerOrdenHijo = function(exp){
        location.href = '/?id=' + exp.folioHijo + '&employee=1';
    };

    ////////////////////////////////////////////////////////////////////////////
    //Genero Nodos
    ////////////////////////////////////////////////////////////////////////////
    var obtieneNodosSuccessCallback = function (data, status, headers, config) {
        //$scope.listaNodos = _Nodes;
        $scope.listaNodos = data;
        //$scope.numElements = _Nodes.length;
        $scope.numElements = data.length;
        //leo la página inicial y voy a ella
        //GetCurrentPage();

        setTimeout(function(){ 
            $('ul#standard').roundabout({
                btnNext: ".next",
                btnNextCallback: function(){
                    goToPageTrigger('.next');
                },
                btnPrev: ".prev",
                btnPrevCallback: function(){
                    goToPageTrigger('.prev');
                },
                clickToFocusCallback: function(){ 
                    goToPageTrigger('.next');
                }
            });
            //Voy a la página actual 
            //Siempre es 1
            goToPage($scope.currentPage);

        },1);

        unidadRepository.getUnidad($scope.unidadHeader.vin)
            .success(getUnidadSuccessCallback)
            .error(errorCallBack);
    };    

    //Succes obtiene lista de documetos por fase y por perfil
    var getUnidadSuccessCallback = function (data, status, headers, config) {
        $scope.unidad = data;
        alertFactory.success('Datos de la unidad cargados.');
    };

    ////////////////////////////////////////////////////////////////////////////
    //Gestión de nodos y validación
    ////////////////////////////////////////////////////////////////////////////

    //Reacciona a los triggers de NEXT PREV CLIC
    var goToPageTrigger = function(button){
        //Veo la página actual
        $scope.currentPage = $('ul#standard').roundabout("getChildInFocus") + 1;
        if($scope.listaNodos[$scope.currentPage - 1].enabled != 0){
            goToPage($scope.currentPage);
        }
        else{
            alertFactory.warning('El nodo ' + $scope.currentPage + ' no está disponible para su perfil.');
            $(button).click();
        }
    };

    //LLeva a un nodo específico desde la navegación
    $scope.setPage = function(nodo) {
        $scope.currentPage = nodo.idFase;
        goToPage($scope.currentPage);  
    };

    //Ir a una página específica
    var goToPage = function(page) {
        $('ul#standard').roundabout("animateToChild", (page - 1));
        $scope.currentNode = $scope.listaNodos[page - 1];
        //Marco el nodo activo en NavBar
        SetActiveNav();
    };

    //Establece la clase de navegación del nodo actual
    var SetActiveNav = function(){
        angular.forEach($scope.listaNodos, function(value, key) {
            if(key == ($scope.currentPage - 1))
                value.active = 1;
            else
                value.active = 0;
        });
        //Ejecuto apply
        Apply();
    }

    //Ejecuta un apply en funciones jQuery
    var Apply = function() {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$apply();
    };

    //Carga de Documento
    $scope.Cargar = function(id){
        $('#frameUpload').attr('src', '/uploader')
        $('#modalUpload').modal('show');
        $rootScope.currentUpload = doc;
        $scope.currentDocId = id;
        localStorageService.set('currentDocId', $scope.currentDocId);
    };

    $scope.mostrarAccesorio = function(){
        $('#viewAccesorio').modal('show');
    }

     $scope.ocultarAccesorio = function(){
        $('#viewAccesorio').modal('hide');
    };

     $('[data-toggle="popover"]').popover();
    
    //animación de switches
    $(".switch").bootstrapSwitch();    
    
    $('#txtOtroAcc').hide($('#cbxOtroAcc').bootstrapSwitch('state'));
    $('#cbxOtroAcc').on('switchChange.bootstrapSwitch', function (event, state){ 
        if(state == true){
            $('#txtOtroAcc').show(1000,function(){
                $('#cbxOtroAcc').bootstrapSwitch('state');
            });
        }
        else{
            $('#txtOtroAcc').hide(1000,function(){
                $('#cbxOtroAcc').bootstrapSwitch('state');
            });
        }                      
    });

    ///Guardar Imagen
    $scope.FinishUpload = function(name){
        alertFactory.success('Imagen ' + name + ' guardada');
        $scope.file = name;
        var doc = $rootScope.currentUpload;
        var currentIdDoc = localStorageService.get('currentDocId');
        var res = $scope.file.substring($scope.file.length-4, $scope.file.length)
        var nombreArchivo = currentIdDoc + res;

        
        //Se guarda el archivo en el servidor
        documentoRepository.saveFile(localStorageService.get('vin'), currentIdDoc, nombreArchivo)
            .success(getSaveFileSuccessCallback)
            .error(errorCallBack);

        //Inserta o actualiza el documento
        unidadRepository.updateDocumento(localStorageService.get('vin'), currentIdDoc, nombreArchivo, localStorageService.get('idUsuario'))
            .success(getSaveSuccessCallback)
            .error(errorCallBack); 
    };

    
    $('.showCtrl').hide();  
    var Control = 0;   
    //insert o actualizar el documento
    $scope.Guardar = function(idDocumento, valor, idControl){

        Control = idControl;
        if(valor == null){
            valor = '';
        }
        if(idDocumento != null && valor != ''){        
        $('#ready'+Control).hide();                 
        $('#loader'+Control).show();       
                                                      
            unidadRepository.updateDocumento(localStorageService.get('vin'), idDocumento, valor, localStorageService.get('idUsuario'))
            .success(getSaveSuccessCallback)
            .error(errorCallBack); 

            //if($scope.modificado != null){
                /*var fechaMod = $scope.modificado[idDocumento-1].fechaMod;
                var nombreUsuario = $scope.modificado[idDocumento-1].nombreUsuario;
                var accion = $scope.modificado[idDocumento-1].accion;
                $scope.listaDocumentos[idDocumento-1].fechaMod = fechaMod;
                $scope.listaDocumentos[idDocumento-1].nombreUsuario = nombreUsuario;
                $scope.listaDocumentos[idDocumento-1].accion = accion;*/
                //$scope.listaDocumentos = $scope.modificado;
            //}        
        }                                                            
    }

    //success para validar si existe el documento
    var getExisteDocumentoSuccessCallback = function (data, status, headers, config) {
        $scope.existeDocumento = data;
        alertFactory.success('Datos de unidad propiedad cargados.');
    };

    //success de insercción y actualización
    var getSaveSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Datos de la unidad guardados.');
        getListaDocumentos();        
        $('#loader'+Control).hide(); 
        $('#ready'+Control).show();      
    };

    //Success de actualizacion de imagen
    var getSaveFileSuccessCallback = function (data, status, headers, config) {
        $scope.rutaNueva = data;  
        //Se valida el id de BD y se sustituye la imágen con la nueva ruta   
        if(localStorageService.get('currentDocId') == 27)
        {
            $('#fotoFrente').attr("src",data);    
        } 
        if(localStorageService.get('currentDocId') == 28)
        {
             $('#fotoTrasera').attr("src",data); 
        } 
        if(localStorageService.get('currentDocId') == 29)
        {
             $('#fotoIzquierda').attr("src",data); 
        }
        if(localStorageService.get('currentDocId') == 30)
        {
             $('#fotoDerecha').attr("src",data); 
        }
        
        alertFactory.success('Imágen Guardada.');
    }

    $scope.Regresar = function(campo) {
        location.href='/busqueda';
    };

    //Success de actualizacion de imagen
    var getSavePdfSuccessCallback = function (data, status, headers, config) {
        $scope.rutaNueva = data;
        alertFactory.success('Archivo Guardado.');
    }

    $scope.verDocumento = function(id){
        var w = 600;
        var h = 550;
        var left = Number((screen.width/2)-(w/2));
        var tops = Number((screen.height/2)-(h/2));
        var ruta = global_settings.downloadPath + localStorageService.get('vin') + '/'+ id + '.pdf';
        window.open(ruta, 'Archivos', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+tops+', left='+left);
    }

    $scope.verFactura = function() {
        window.open('http://192.168.20.9/Documentos/factura.pdf');
    }
});
