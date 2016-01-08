registrationModule.controller("loginController", function ($scope, $rootScope, localStorageService, alertFactory, loginRepository, rolRepository) {

    //Propiedades
    $scope.isLoading = false;
    $scope.idProceso = 1;
    $scope.perfil = 1;

    //Deshabilitamos el clic derecho en toda la aplicación
    //window.frames.document.oncontextmenu = function(){ alertFactory.error('Función deshabilitada en digitalización.'); return false; };

    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Grupo de funciones de inicio
    $scope.init = function () {
        //Obtengo la lista de roles
        rolRepository.getAll()
            .success(getAllRolSuccessCallback)
            .error(errorCallBack);
    };

    //Obtiene todos los roles
    var getAllRolSuccessCallback = function (data, status, headers, config) {
        $scope.listaRoles = data;
    };

    $scope.IniciarSesion = function () {
        //Loguea al usuario
        loginRepository.login($scope.usuario, $scope.password)
            .success(loginSuccessCallback)
            .error(errorCallBack);
    };


    var loginSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Bienvenido Usuario');
        location.href = '/busqueda';
    };

    $scope.Registro = function () {
        loginRepository.add($scope.currentRol.idRol,$scope.nombre,$scope.correo,$scope.contrasena1)
            .success(addRegisterSuccessCallback)
            .error(errorCallBack);
    };

    var addRegisterSuccessCallback = function (data, status, headers, config) {
        $scope.listaRoles = data;
    };

    //Asigna el rol actual seleccionado
    $scope.SetCurrentRol = function(rol) {
        $scope.currentRol = rol;
    };
  

});
