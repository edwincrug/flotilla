registrationModule.controller("nodoController", function ($scope, $rootScope, localStorageService, alertFactory, nodoRepository, unidadRepository, documentoRepository) {

    //Propiedades
    $scope.isLoading = false;
    $scope.idProceso = 1;
    $scope.perfil = 1;

    $scope.idRol = 20;
    $scope.idFase = 1;

    //Deshabilitamos el clic derecho en toda la aplicación
    //window.frames.document.oncontextmenu = function(){ alertFactory.error('Función deshabilitada en digitalización.'); return false; };

    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Obtengo los datos del empleado loguado
        $scope.empleado = localStorageService.get('employeeLogged');
        //Obtenfo los datos del VIN
        $scope.unidad = localStorageService.get('currentVIN');

        unidadRepository.getHeader($scope.unidad.vin)
            .success(obtieneHeaderSuccessCallback)
            .error(errorCallBack);

        nodoRepository.getRolPermiso($scope.empleado.idRol, localStorageService.get('vin'))
            .success(obtieneRolPermisoSuccesCallback)
            .error(errorCallBack);   

        $('#placa').hide();   
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

    var obtieneRolPermisoSuccesCallback = function(data, status, headers, config){
        $scope.rolPermiso = data;        
    };

/*    var getEmpleadoSuccessCallback = function (data, status, headers, config) {
        $rootScope.empleado = data;
        //Obtenemos la lista de nodos completos
        if($rootScope.empleado != null){
            if(getParameterByName('id')){
                //Obtengo el encabezado del expediente
                nodoRepository.getHeader(getParameterByName('id'),$rootScope.empleado.idRol)
                    .success(obtieneHeaderSuccessCallback)
                    .error(errorCallBack);
            }
        }
        else
            alertFactory.error('El empleado no existe en el sistema.');
        
    };*/

    //Success al obtener expediente
  /*  var obtieneHeaderSuccessCallback = function (data, status, headers, config) {
        //Asigno el objeto encabezado
        $scope.expediente = data;
        if($scope.expediente != null){
            //Obtengo la información de los nodos
            nodoRepository.getFasePermiso($rootScope.usuario.idRol)
                .success(obtieneNodosSuccessCallback)
                .error(errorCallBack);
        }
        else
            alertFactory.error('No existe información para este expediente.');
    };*/

    //Muestra los nodos del perfil
    /*$scope.mostrarNodos = function(idRol){
        nodoRepository.getFasePermiso($scope.idRol)
                .success(obtieneNodosSuccessCallback)
                .error(errorCallBack);
    }*/
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
        //Cargo el contenido de nodo
        LoadActiveNode();
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

    /////////////////////////////////////////////////////////////////////////
    //Obtengo la lista de documentos disponibles por nodo
    /////////////////////////////////////////////////////////////////////////
    //Success de carga de alertas
    var getAlertasSuccessCallback = function (data, status, headers, config) {
        $scope.isLoading = false; 
        $scope.listaAlertas = data;
        Apply();
    };

    //Success de obtner documentos por nodo
    var getDocumentosSuccessCallback = function (data, status, headers, config) {
        $scope.listaDocumentos = data;
        nodoRepository.getDocFasePermiso($scope.idRol, $scope.idFase)
            .success(getAlertasSuccessCallback)
            .error(errorCallBack);
    };

    //Carga los documentos del nodo activo
    var LoadActiveNode = function(){
        //if($scope.currentNode.estatus != 1){
            $scope.isLoading = true;
            Apply();
            //Consulta el repositorio
            nodoRepository.getDocFasePermiso($scope.idRol, $scope.idFase)
                .success(getDocumentosSuccessCallback)
                .error(errorCallBack);
        //}
        //else
            //alertFactory.warning('El nodo ' + $scope.currentNode.idFase + ' aún no se activa para el expediente actual. No existen documentos para mostrar.')
    };

    //Ejecuta un apply en funciones jQuery
    var Apply = function() {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
            $scope.$apply();
    };

    ///Carga dauto
    $scope.Cargar = function(){
        $('#frameUpload').attr('src', '/uploader')
        $('#modalUpload').modal('show');
        $rootScope.currentUpload = doc;
    };

    $scope.mostrarAccesorio = function(){
        $('#viewAccesorio').modal('show');
    }

     $scope.ocultarAccesorio = function(){
        $('#viewAccesorio').modal('hide');
    };

     $('[data-toggle="popover"]').popover();
    
    //animación de switches
    $("[name='cbxGatoUni']").bootstrapSwitch();
    $("[name='cbxLlaveTuerca']").bootstrapSwitch();
    $("[name='cbxManeral']").bootstrapSwitch();
    $("[name='cbxRefaccion']").bootstrapSwitch();
    $("[name='cbxTapAlfombra']").bootstrapSwitch();
    $("[name='cbxTapPlastico']").bootstrapSwitch();
    $("[name='cbxTriSeguridad']").bootstrapSwitch();
    $("[name='cbxBirlo']").bootstrapSwitch();
    $("[name='cbxCable']").bootstrapSwitch();
    $("[name='cbxExtintor']").bootstrapSwitch();    
    $("[name='cbxOtro']").bootstrapSwitch();
    
    
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

    $scope.FinishUpload = function(name){
        alertFactory.success('Imagen ' + name + ' guardada');
        var doc = $rootScope.currentUpload;
        
        //Se guarda el archivo en el servidor
        documentoRepository.saveFile(localStorageService.get('vin'),40, name)
            .success(getSaveFileSuccessCallback)
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
                                                      
            unidadRepository.updateDocumento(localStorageService.get('vin'), idDocumento, valor, $scope.empleado.idUsuario)
            .success(getSaveSuccessCallback)
            .error(errorCallBack);         
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
        $('#loader'+Control).hide(); 
        $('#ready'+Control).show();      
    };

    //Success de actualizacion de imagen
    var getSaveFileSuccessCallback = function (data, status, headers, config) {
        $scope.rutaNueva = data;        
        var resu = $scope.rutaNueva.substring($scope.rutaNueva.length-3, $scope.rutaNueva.length)
        if(resu == 'png')
        {
            $('#fotoFrente').attr("src",data);    
        } 
        else
        {
            $('#placaDoc').show();  
            $('#poliza').show();     
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

    $scope.verDocumento = function(){
        window.open("http://www.w3schools.com");
    }

    $scope.verFactura = function() {
        window.open('http://192.168.20.9/Documentos/factura.pdf');
    }
});
