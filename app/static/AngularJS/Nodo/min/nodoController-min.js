registrationModule.controller("nodoController",function(e,o,n,r,a,t){e.isLoading=!1,e.idProceso=1,e.perfil=1,e.idUsuario=20,e.idFase=1;var i=function(e,o,n,a){$("#btnEnviar").button("reset"),r.error("Ocurrio un problema")};e.init=function(){e.empleado=n.get("employeeLogged"),e.unidad=n.get("currentVIN"),t.getHeader(e.unidad.vin).success(s).error(i)};var s=function(o,n,r,t){e.unidadHeader=o,e.currentPage=e.unidadHeader.faseActual,a.getFasePermiso(e.empleado.idUsuario).success(u).error(i)};e.mostrarNodos=function(o){a.getFasePermiso(e.idUsuario).success(u).error(i)},e.VerOrdenPadre=function(e){location.href="/?id="+e.folioPadre+"&employee=1"},e.VerOrdenHijo=function(e){location.href="/?id="+e.folioHijo+"&employee=1"};var u=function(o,n,r,a){e.listaNodos=o,e.numElements=o.length,setTimeout(function(){$("ul#standard").roundabout({btnNext:".next",btnNextCallback:function(){c(".next")},btnPrev:".prev",btnPrevCallback:function(){c(".prev")},clickToFocusCallback:function(){c(".next")}}),l(e.currentPage)},1),t.getUnidad(e.unidadHeader.vin).success(d).error(i)},d=function(o,n,a,t){e.unidad=o,r.success("Datos de la unidad cargados.")},c=function(o){e.currentPage=$("ul#standard").roundabout("getChildInFocus")+1,0!=e.listaNodos[e.currentPage-1].enabled?l(e.currentPage):(r.warning("El nodo "+e.currentPage+" no está disponible para su perfil."),$(o).click())};e.setPage=function(o){e.currentPage=o.idFase,l(e.currentPage)};var l=function(o){$("ul#standard").roundabout("animateToChild",o-1),e.currentNode=e.listaNodos[o-1],f(),m()},f=function(){angular.forEach(e.listaNodos,function(o,n){n==e.currentPage-1?o.active=1:o.active=0}),P()},g=function(o,n,r,a){e.isLoading=!1,e.listaAlertas=o,P()},p=function(o,n,r,t){e.listaDocumentos=o,a.getDocFasePermiso(e.idUsuario,e.idFase).success(g).error(i)},m=function(){e.isLoading=!0,P(),a.getDocFasePermiso(e.idUsuario,e.idFase).success(p).error(i)},P=function(){"$apply"!=e.$root.$$phase&&"$digest"!=e.$root.$$phase&&e.$apply()};e.Cargar=function(){$("#frameUpload").attr("src","/uploader"),$("#modalUpload").modal("show"),o.currentUpload=doc}});