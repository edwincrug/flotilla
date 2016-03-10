registrationModule.controller("reporteController", function ($scope, $rootScope, localStorageService, alertFactory, reporteRepository) {
    
    $scope.Init = function () {
        alertFactory.info('Cargué!');
    }
});