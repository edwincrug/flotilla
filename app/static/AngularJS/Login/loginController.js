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

        //Obtener empleado logueado
        $scope.empleado = localStorageService.get('employeeLogged');
        if($scope.empleado != null){
            location.href = '/busqueda'; 
        }
    };

    //Obtiene todos los roles
    var getAllRolSuccessCallback = function (data, status, headers, config) {
        $scope.listaRoles = data;
    };

    $scope.IniciarSesion = function () {
        $('#btnIngresar').button('loading');
        //Loguea al usuario
        loginRepository.login($scope.usuario, $scope.password)
            .success(loginSuccessCallback)
            .error(errorCallBack);
    };


    var loginSuccessCallback = function (data, status, headers, config) {
        if(data != null){
            //Guardo empleado logueado
            $scope.empleado = data;

            localStorageService.set('employeeLogged', $scope.empleado);
            alertFactory.success('Bienvenido ' + $scope.empleado.nombreCompleto );
            setTimeout(function(){
                location.href = '/busqueda';
            }, 500);
        }
        else{
            alertFactory.warning('Usuario y/o password incorrecto.');
        }
        //regreso el objeto a su estado original
        $('#btnIngresar').button('reset');
    };

    $scope.Registro = function () {
        loginRepository.add($scope.currentRol.idRol,$scope.nombre,$scope.correo,$scope.contrasena1)
            .success(addRegisterSuccessCallback)
            .error(errorCallBack);
    };

    var addRegisterSuccessCallback = function (data, status, headers, config) {
        alertFactory.info('Hemos registrado su información con éxito.');
        alertFactory.info('Para completar el registro verifique el correo electrónico que le hemos enviado.');
    };

    //Asigna el rol actual seleccionado
    $scope.SetCurrentRol = function(rol) {
        $scope.currentRol = rol;
    };
  

});
