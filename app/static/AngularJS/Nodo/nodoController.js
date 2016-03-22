registrationModule.controller("nodoController", function ($scope, $rootScope, localStorageService, alertFactory, nodoRepository, unidadRepository, documentoRepository, busquedaRepository) {

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
    $scope.idFrente = 26;
    $scope.idTrasera = 27;
    $scope.idCostadoIzq = 28;
    $scope.idCostadoDer = 29;    

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

        unidadRepository.getHeader(localStorageService.get('currentVIN').vin)
            .success(obtieneHeaderSuccessCallback)
            .error(errorCallBack);

        getListaDocumentos();

        $('#placaDoc').hide(); 
        $('[data-toggle="popover"]').popover()
        $scope.desabilitaBtnCerrar();
    };

    /////////////////////
    ///Header
    ////////////////////

    var obtieneHeaderSuccessCallback = function (data, status, headers, config) {
       $scope.unidadHeader = data;
       $scope.valVin = $scope.unidadHeader.vin;
       //Obtengo los datos del empleado logueado       
       $scope.currentPage = $scope.unidadHeader.faseActual;
      
       //Obtengo la lista de fases
       nodoRepository.getFasePermiso($scope.empleado.idRol)
                .success(obtieneNodosSuccessCallback)
                .error(errorCallBack);      
    };

    var getListaDocumentos = function(){
        nodoRepository.getRolPermiso(localStorageService.get('idRol'), localStorageService.get('currentVIN').vin)
            .success(obtieneRolPermisoSuccesCallback)
            .error(errorCallBack); 
    }

    var obtieneRolPermisoSuccesCallback = function(data, status, headers, config){
        $scope.listaDocumentos = data;
        $scope.fechaEntregaUni = {
         value: new Date($scope.listaDocumentos[24].valor)
        };
        $scope.listaDocumentos[24].valor = $scope.fechaEntregaUni.value;
       
        $scope.frente = $scope.listaDocumentos[$scope.idFrente].valor;
        $scope.costadoDer = $scope.listaDocumentos[$scope.idCostadoDer].valor;
        $scope.costadoIzq = $scope.listaDocumentos[$scope.idCostadoIzq].valor;
        $scope.trasera = $scope.listaDocumentos[$scope.idTrasera].valor;
        localStorageService.set('frente',$scope.frente);
        localStorageService.set('costadoDer',$scope.costadoDer);
        localStorageService.set('costadoIzq',$scope.costadoIzq);
        localStorageService.set('trasera',$scope.trasera);

        //Se cargan las imagenes de autos
        if(localStorageService.get('frente') != null)
        {
            var ext = ObtenerExtArchivo(localStorageService.get('frente'));
            url = global_settings.downloadPath + localStorageService.get('currentVIN').vin + '/' + ($scope.idFrente + 1) + ext;
            $('#fotoFrente').attr("src",url);    
        } 
        if(localStorageService.get('trasera') != null)
        {
            var ext = ObtenerExtArchivo(localStorageService.get('trasera'));
            url = global_settings.downloadPath + localStorageService.get('currentVIN').vin + '/' + ($scope.idTrasera + 1) + ext;
            $('#fotoTrasera').attr("src",url); 
        } 
        if(localStorageService.get('costadoIzq') != null)
        {
            var ext = ObtenerExtArchivo(localStorageService.get('costadoIzq'));
            url = global_settings.downloadPath + localStorageService.get('currentVIN').vin + '/' + ($scope.idCostadoIzq + 1) + ext;
            $('#fotoIzquierda').attr("src",url); 
        }
        if(localStorageService.get('costadoDer') != null)
        {
            var ext = ObtenerExtArchivo(localStorageService.get('costadoDer'));
            url = global_settings.downloadPath + localStorageService.get('currentVIN').vin + '/' + ($scope.idCostadoDer + 1) + ext;
            $('#fotoDerecha').attr("src",url); 
        } 

		Apply();     
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
    
    $('#35').hide($('#33').bootstrapSwitch('state'));
    $('#33').on('switchChange.bootstrapSwitch', function (event, state){ 
        if(state == true){
            $('#35').show(1000,function(){
                $('#33').bootstrapSwitch('state');
            });
        }
        else{            
            $scope.Guardar(35, '');
            $('#35').hide(1000,function(){
                $('#33').bootstrapSwitch('state');                
            });
        }                      
    });

    ///Guardar Imagen
    $scope.FinishUpload = function(name){
        var doc = $rootScope.currentUpload;
        var currentIdDoc = localStorageService.get('currentDocId');
        var ext = ObtenerExtArchivo(name);
        var nombreArchivo = currentIdDoc + ext;

        
        //Se guarda el archivo en el servidor
        documentoRepository.saveFile(localStorageService.get('currentVIN').vin, currentIdDoc, name)
            .success(getSaveFileSuccessCallback)
            .error(errorCallBack);

        //Inserta o actualiza el documento
        unidadRepository.updateDocumento(localStorageService.get('currentVIN').vin, currentIdDoc, name, localStorageService.get('idUsuario'))
            .success(getSaveSuccessCallback)
            .error(errorCallBack);

        alertFactory.success('Imagen ' + name + ' guardada');
    };

    
    $('.showCtrl').hide();  
    var Control = 0;   
    //insert o actualizar el documento
     $scope.Guardar = function(idDocumento, valor){        

        if(idDocumento != null && ($scope.listaDocumentos[idDocumento-1].accion != null || valor != '')){ 
            Control = idDocumento;
            $('#ready'+Control).hide();                 
            $('#loader'+Control).show();       
                                                      
            unidadRepository.updateDocumento(localStorageService.get('currentVIN').vin, idDocumento, valor, localStorageService.get('idUsuario'))
            .success(getSaveSuccessCallback)
            .error(errorCallBack);  

            if(idDocumento == 35){
                $scope.Guardar(33, $('#33').bootstrapSwitch('state'));
            }             
        }                                                            
    }

    //actualiza o inserta el accesorio para la unidad(accesorio)
    $('.switch').on('switchChange.bootstrapSwitch', function (event, state){
        Control = this.id    
        if(this.id != 33 && initSwitches != 0){
            unidadRepository.updateDocumento(localStorageService.get('currentVIN').vin, this.id , state, localStorageService.get('idUsuario'))
            .success(getSaveSuccessCallback)
            .error(errorCallBack);
        }        
    }); 
        
    //recorre los switches para obtener los estados en los que se guardaron
    var switchState = false; 
    var initSwitches;   
    $('#btnAccesorio').click(function(){  
        initSwitches = 0;     
        getListaDocumentos();      
        $('#divSwitchAcc input:checkbox').each(function(index){   
            switchState = $scope.listaDocumentos[this.id-1].valor; 
            if(switchState == 'true'){
            $('#'+this.id).bootstrapSwitch('state',true);
            }
            else{
                $('#'+this.id).bootstrapSwitch('state',false);
            }                                 
        });       
        initSwitches = 1; 
    });
        
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
        actualizaPropiedadUnidad();
        $scope.desabilitaBtnCerrar();    

    };

    //Success de actualizacion de imagen
    var getSaveFileSuccessCallback = function (data, status, headers, config) {
        $scope.rutaNueva = data;  
        //Se valida el id de BD y se sustituye la imágen con la nueva ruta   
        if(localStorageService.get('currentDocId') == ($scope.idFrente + 1))
        {
            $('#fotoFrente').attr("src",data);    
        } 
        if(localStorageService.get('currentDocId') == ($scope.idTrasera + 1))
        {
             $('#fotoTrasera').attr("src",data); 
        } 
        if(localStorageService.get('currentDocId') == ($scope.idCostadoIzq + 1))
        {
             $('#fotoIzquierda').attr("src",data); 
        }
        if(localStorageService.get('currentDocId') == ($scope.idCostadoDer + 1))
        {
             $('#fotoDerecha').attr("src",data); 
        }
        
        alertFactory.success('Imágen Guardada.');
    }

    //Botón regresar
    $scope.Regresar = function(campo) {
        location.href='/busqueda';
    };

    //Success de actualizacion de PDF
    var getSavePdfSuccessCallback = function (data, status, headers, config) {
        $scope.rutaNueva = data;
        getListaDocumentos();
        alertFactory.success('Archivo Guardado.');
    }

    $scope.verFactura = function() {
        var pdf_link = 'http://192.168.20.9/Documentos/factura.pdf';
        var iframe = '<div id="hideFullContent"><div id="hideFullMenu" onclick="nodisponible()" ng-controller="nodoController"> </div> <object id="ifDocument" data="' + pdf_link + '" type="application/pdf" width="100%" height="100%"></object></div>';
        $.createModal({
            message: iframe,
            closeButton: false,
            scrollable: false
        });  
    }

    //oculta los popovers al dar clic en el body
    $('[data-toggle="popover"]').popover();

    $('body').on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
           
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    //Método para mostrar documento PDF, JPG o PNG
    $scope.VerDocumento = function(idDoc, valor) {
        var ext = ObtenerExtArchivo(valor);
        var type = '';
        if(ext == '.jpg'){
            type = "image/jpg";
        } else if(ext == '.png'){
            type = "image/png";
        } else{
            type = "application/pdf";
        }
        var ruta = global_settings.downloadPath + localStorageService.get('currentVIN').vin + '/'+ idDoc + ext;
        var pdf_link = ruta;
        var titulo = localStorageService.get('currentVIN').vin + ' :: ' + valor;
        var iframe = '<div id="hideFullContent"><div id="hideFullMenu" onclick="nodisponible()" ng-controller="nodoController"> </div> <object id="ifDocument" data="' + pdf_link + '" type="' + type + '" width="100%" height="100%"></object></div>';
        $.createModal({
            title: titulo,
            message: iframe,
            closeButton: false,
            scrollable: false
        });        
    };

    //Método para obtener la extension del archivo
    var ObtenerExtArchivo = function(file){
        $scope.file = file;
        var res = $scope.file.substring($scope.file.length-4, $scope.file.length)
        return res;
    }

    //deshabilitar botón de cerrar licitación
    $scope.desabilitaBtnCerrar = function(){
        var subidos, total;
        if(localStorageService.get('currentVIN').estatus != 'Cerrado'){
            if($scope.numDocumento == null){
                subidos = parseInt(localStorageService.get('currentVIN').subidos);
                total = parseInt(localStorageService.get('currentVIN').total);
            }
            else{
                subidos = parseInt($scope.numDocumento[0].subidos);
                total = parseInt($scope.numDocumento[0].total);
            }
                
            if(subidos == total)
                return false;
            else
                return true;  

        }
        else
            return true;
        
    }

    //cierra documentación final del automóvil de la licitación
    $scope.cierraLicitacionVIN = function(){
        $('#btnCerrarUnidad').button('loading');
        unidadRepository.updateLicitacionVIN(localStorageService.get('currentVIN').vin, localStorageService.get('currentVIN').idLicitacion,'Cerrado')
        .success(getUpdLicitacionVINSuccessCallback)
        .error(errorCallBack);

    }

    //mensaje de éxito del cierre de entrega de documentos del vehículo para una licitación determinada
    var getUpdLicitacionVINSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Estatus de licitación del automóvil Cerrado.');
        $scope.unidadHeader.estatus = 'Cerrado';
        $('#btnCerrarUnidad').button('reset');                
    };

    //actualiza los datos del localStorage de la unidad
    var actualizaPropiedadUnidad = function(){
        busquedaRepository.getFlotilla(localStorageService.get('currentVIN').factura, localStorageService.get('currentVIN').vin)
                .success(getFlotillaSuccessCallback)
                .error(errorCallBack);
    }

     //Succes obtiene lista de objetos de las flotillas
    var getFlotillaSuccessCallback = function (data, status, headers, config) {
        $scope.numDocumento = data;
    };
    
});
