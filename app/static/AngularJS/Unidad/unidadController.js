registrationModule.controller("unidadController", function ($scope, $filter, $rootScope, localStorageService, alertFactory, unidadRepository,mancomunadoRepository, filtroRepository) {
	//Grupo de funciones de inicio
    $scope.init = function () {
        getData();
    };

    //Recarga Pantalla Principal
    var getData = function(){

        unidadRepository.getFasePermiso($scope.idUsuario)
            .success(getFasePermisoSuccessCallback)
            .error(errorCallBack);
                                                      
        unidadRepository.getDocFasePermiso($scope.idUsuario, $scope.idFase)
            .success(getDocFasePermisoSuccessCallback)
            .error(errorCallBack);
    }
    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        getData();
        alertFactory.error('Ocurrio un problema: ' + data);
    };

    //Succes obtiene lista de fases por perfil
    var getFasePermisoSuccessCallback = function (data, status, headers, config) {
        $scope.fasePermiso = data;
        alertFactory.success('Datos de las fases cargados.');
    };

    //Succes obtiene lista de documetos por fase y por perfil
    var getDocFasePermisoSuccessCallback = function (data, status, headers, config) {
        $scope.docFasePermiso = data;
        alertFactory.success('Documentos cargados de las fases.');
    };

    //Obtiene la unidad mediante el vin
    $scope.getUnidad = function(vin){        
        unidadRepository.getUnidad(vin)
            .success(getAprobadoresSuccessCallback)
            .error(errorCallBack);
    };

    //Succes obtiene lista de documetos por fase y por perfil
    var getUnidadSuccessCallback = function (data, status, headers, config) {
        $scope.unidad = data;
        alertFactory.success('Datos de la unidad cargados.');
    };
}