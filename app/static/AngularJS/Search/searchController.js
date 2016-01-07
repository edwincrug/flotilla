registrationModule.controller("searchController", function ($scope, $rootScope, localStorageService, alertFactory, searchRepository) {

    //Propiedades
    $rootScope.searchlevel = 1;

    //Desconfiguramos el clic izquierdo en el frame contenedor de documento
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        //$rootScope.hasExp = true;
        $scope.loadDivision();
        $scope.loadTipos();
    };

    $scope.Search = function() {
        $('#searchResults').modal('show');

    	// $("#finder").animate({
     //        width: "show"
     //    });
    };

    //Script para salir
    ///////////////////////////////////////////////////////////////////////////
    $scope.Salir = function() {
        var ventana = window.self;
        ventana.opener = window.self;
        ventana.close();
    };
    
    $scope.CloseGrid = function() {
    	$("#finder").animate({
            width: "hide"
        });
        //$rootScope.hasExp = true;
    };

    $scope.HideView = function() {
        //$rootScope.hasExp = false;
    };

    ///////////////////////////////////////////////////////////////////////////
    //Carga los tipos de órden de compra
    $scope.loadTipos = function() {
        searchRepository.getTipos()
            .success(getTiposSuccessCallback)
            .error(errorCallBack);
    };

    var getTiposSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaTipos = data;
    }

    $scope.SetTipo = function(tip) {
        $rootScope.tipo = tip;
    };

    $scope.ClearTipo = function() {
        $rootScope.tipo = null;
    };

    //////////////////////////////////////////////////////////////////////////
    //Establece la división
    //////////////////////////////////////////////////////////////////////////
    var getDivisionSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaDivisiones = data;
    }

    $scope.loadDivision = function() {
        searchRepository.getDivision()
            .success(getDivisionSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetDivision = function(div) {
        $scope.ClearDivision();
        $rootScope.division = div; 
        $rootScope.searchlevel = 2;
        $scope.LoadEmpresa();

    };

    $scope.ClearDivision = function() {
        $rootScope.division = null; 
        $rootScope.searchlevel = 1;
        $rootScope.empresa = null; 
        $rootScope.agencia = null; 
        $rootScope.departamento = null; 
    }

    //////////////////////////////////////////////////////////////////////////
    //Establece la empresa
    //////////////////////////////////////////////////////////////////////////
    var getEmpresaSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaEmpresas = data;
    }

    $scope.LoadEmpresa = function() {
        searchRepository.getEmpresa($rootScope.empleado.idUsuario)
            .success(getEmpresaSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetEmpresa = function(emp) {
        $scope.ClearEmpresa();
        $rootScope.empresa = emp; 
        $rootScope.searchlevel = 3;
        $scope.LoadAgencia();
    };

    $scope.ClearEmpresa = function() {
        $rootScope.empresa = null; 
        $rootScope.searchlevel = 2;
        $rootScope.agencia = null; 
        $rootScope.departamento = null; 
    }
    
    //////////////////////////////////////////////////////////////////////////
    //Establece la agencia
    //////////////////////////////////////////////////////////////////////////
    var getAgenciaSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaAgencias = data;
    }

    $scope.LoadAgencia = function() {
        searchRepository.getSucursal($rootScope.empleado.idUsuario,$rootScope.empresa.idEmpresa)
            .success(getAgenciaSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetAgencia = function(age) {
        $scope.ClearAgencia();
        $rootScope.agencia = age; 
        $rootScope.searchlevel = 4;
        $scope.LoadDepartamento();
    };

    $scope.ClearAgencia = function() {
        $rootScope.agencia = null; 
        $rootScope.searchlevel = 3;
        $rootScope.departamento = null; 
    }

    //////////////////////////////////////////////////////////////////////////
    //Departamento
    //////////////////////////////////////////////////////////////////////////
    var getDepartamentoSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaDepartamentos = data;
    }

    $scope.LoadDepartamento = function() {
        searchRepository.getDepartamento($rootScope.empleado.idUsuario, $rootScope.empresa.idEmpresa, $rootScope.agencia.idSucursal)
            .success(getDepartamentoSuccessCallback)
            .error(errorCallBack);
    }

    $scope.SetDepartamento = function(dep) {
        $rootScope.departamento = dep; 
        $rootScope.searchlevel = 5;
    };

    $scope.ClearDepartamento = function() {
        $rootScope.departamento = null; 
    }

    //////////////////////////////////////////////////////////////////////////
    //Obtiene los proveedores
    $scope.ShowSearchProveedor = function() {
        $('#searchProveedor').modal('show');
    };

    $scope.BuscarProveedor = function(){
         searchRepository.getProveedor($scope.textProveedor)
            .success(getProveedorSuccessCallback)
            .error(errorCallBack);
    };

    var getProveedorSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaProveedores = data;
        alertFactory.success('Se ha(n) encontrado ' + data.length + ' proveedor(es) que coniciden con la búsqueda.');
    };

    $scope.SetProveedor = function(pro) {
        $rootScope.proveedor = pro;
        $('#searchProveedor').modal('hide');
    };

    $scope.ClearProveedor = function() {
        $rootScope.proveedor = null; 
    }

    //////////////////////////////////////////////////////////////////////////
    //DatePicker
    $scope.today = function () {
        $scope.dt1 = new Date();
        $scope.dt2 = new Date();
    };

    $scope.today();

    $scope.clear = function () {
        $scope.dt1 = null;
        $scope.dt2 = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1 = true;
    };

    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $rootScope.format = $scope.formats[0];

});