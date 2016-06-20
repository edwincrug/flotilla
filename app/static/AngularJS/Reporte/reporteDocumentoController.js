registrationModule.controller("reporteDocumentoController", function ($scope, $rootScope, localStorageService, alertFactory, reporteRepository) {
    $scope.arrayDocumentos = [17,19];//,23,31];
    $scope.avance = '';
    $scope.total = '';
    $scope.faltante = '';
    
    $scope.Init = function () {
        getClientes();
    }
    
    $scope.getReportePoliza =  function (idCliente){
        if(idCliente == '' || idCliente == null){
            alertFactory.info('Seleccione un cliente');
        } else{
            reporteRepository.getReporte(idCliente)
                    .success(getReporteSuccessCallback)
                    .error(errorCallBack);
        }
    }
    
    var getClientes = function(){
        reporteRepository.getCliente()
            .success(getClienteSuccessCallback)
            .error(errorCallBack);
    }

    var getReporteSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Resultados cargados.');
        $scope.avance23 = data[0].avance23;
        $scope.avance13 = data[0].avance13;
        $scope.avance19 = data[0].avance19;
        $scope.avance31 = data[0].avance31;
        $scope.avance24 = data[0].avance24;
        $scope.avance16 = data[0].avance16;
        $scope.avance22 = data[0].avance22;
        $scope.avance36 = data[0].avance36;
        $scope.avance46 = data[0].avance46;    
        $scope.total = data[0].total;
        setTimeout(function(){
            $('#pie23').ready(function(){
            c3.generate({
            bindto: '#pie23',
            data:{
                columns: [
                    ['Avance', $scope.avance23],
                    ['Faltan', $scope.total - $scope.avance23]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        $('#pie13').ready(function(){
            c3.generate({
            bindto: '#pie13',
            data:{
                columns: [
                    ['Avance', $scope.avance13],
                    ['Faltan', $scope.total - $scope.avance13]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        $('#pie31').ready(function(){
            c3.generate({
            bindto: '#pie31',
            data:{
                columns: [
                    ['Avance', $scope.avance31],
                    ['Faltan', $scope.total - $scope.avance31]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        $('#pie24').ready(function(){
            c3.generate({
            bindto: '#pie24',
            data:{
                columns: [
                    ['Avance', $scope.avance24],
                    ['Faltan', $scope.total - $scope.avance24]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        $('#pie19').ready(function(){
            c3.generate({
            bindto: '#pie19',
            data:{
                columns: [
                    ['Avance', $scope.avance19],
                    ['Faltan', $scope.total - $scope.avance19]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        $('#pie16').ready(function(){
            c3.generate({
            bindto: '#pie16',
            data:{
                columns: [
                    ['Avance', $scope.avance16],
                    ['Faltan', $scope.total - $scope.avance16]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        $('#pie22').ready(function(){
            c3.generate({
            bindto: '#pie22',
            data:{
                columns: [
                    ['Avance', $scope.avance22],
                    ['Faltan', $scope.total - $scope.avance22]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        $('#pie36').ready(function(){
            c3.generate({
            bindto: '#pie36',
            data:{
                columns: [
                    ['Avance', $scope.avance36],
                    ['Faltan', $scope.total - $scope.avance36]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        $('#pie46').ready(function(){
            c3.generate({
            bindto: '#pie46',
            data:{
                columns: [
                    ['Avance', $scope.avance46],
                    ['Faltan', $scope.total - $scope.avance46]
                ],
                colors:{
                     Avance: '#0974C6',
                     Faltan: '#F77F08'
                },
                type : 'pie'
            }
            });
        });
        },10);
        };

    var errorCallBack = function (data, status, headers, config) {
        alertFactory.error('Error');
    };
    
     var getClienteSuccessCallback = function (data, status, headers, config) {
        $scope.clientes = data;
        alertFactory.success('Clientes Cargados.');
    };

});