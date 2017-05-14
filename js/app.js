var navPila = [];

var fnRefrescar = {
    'pgPrincipal': refrescarPrincipal,
    'pgNuevaTarea': refrescarNuevaTarea,
    'pgEditarTarea': refrescarEditarTarea,
    'pgTodasTareas': refrescarTodasTareas
};

$(function() {
    // eventos pgPrincipal
    $('#pgPrincipal #btNuevaTarea').click(function() {
        navSaltar('pgNuevaTarea');
    });
    $('#pgPrincipal #btTodasTareas').click(function() {
        navSaltar('pgTodasTareas');
    });
    // eventos pgNuevaTarea
    $('#pgNuevaTarea #btAceptar').click(function() {
        // guardar tarea
        nuevaTarea($('#txtTitulo').val(), $('#fechaVencimiento').val());
        navAtras();
    });
    $('#pgNuevaTarea #btCancelar').click(function() {
        navAtras();
    });
    // eventos pgTodasTareas
    $('#pgTodasTareas input').change(function() {
        refrescarTodasTareas();
        cambiarPagina('pgTodasTareas');
    });
    // eventos atrás
    $('.header a').click(function() {
        navAtras();
    });
    navSaltar('pgPrincipal');
});

function cambiarPagina(pag, pagAnterior) {
    console.log('cambiarPagina(' + pag + ',' + pagAnterior + ')');
    if (pagAnterior)
        $('#' + pagAnterior).css('display', 'none');
    $('#' + pag).css('display', 'block');
    // ajustar altura
    $('#' + pag + ' .content').height('auto');
    // añadir pie de página
    $('#' + pag + ' .content').height(
        $('#' + pag + ' .content').height() + $('#' + pag + ' .footer').height());
    // ocultar barra de navegación
    window.scrollTo(0, 1);
}

function navSaltar(pag) {
    var pagAnterior;
    console.log('navSaltar(' + pag + ')');
    // 1. recuperar página anterior
    if (navPila.length > 0)
        pagAnterior = navPila[navPila.length - 1];
    // 2. apilar página nueva
    navPila.push(pag);
    // 3. refrescar página nueva
    var args = [];
    for (var i = 1; i < arguments.length; i++)
        args[i - 1] = arguments[i];
    fnRefrescar[pag](args);
    // 4. cambiar página
    cambiarPagina(pag, pagAnterior);
}

function navAtras() {
    var pgActual = navPila.pop();
    console.log('navAtras()');
    // 1. desapilar actual
    if (navPila.length > 0) {
        // 2. obtener anterior
        var pgAnterior = navPila[navPila.length - 1];
        // 3. refrescar
        fnRefrescar[pgAnterior]();
        // 4. mostrar
        cambiarPagina(pgAnterior, pgActual);
    }
}

function refrescarPrincipal() {  
	var i = 0; 
    var j = 0;
    var fecha = new Date();
    fecha = fecha.getDate() + "/" + (fecha.getMonth() +1) + "/" +fecha.getFullYear();
    console.log('refrescarPrincipal()');
    console.log('var i' + i);
    $('#pgPrincipal .lista-tarea').empty();
    while (i < tareasDB.length){    	
    	if ((getFechaVencimiento(i)!="") && (fecha > getFechaVencimiento(i))){
    		console.log("true");
    		$('#pgPrincipal .lista-tarea').append(
                '<li class= "vencida" ' + 'onclick="navSaltar(\'pgEditarTarea\',' + getId(i) + ')">Tarea: ' + getTitulo(i) + '</li>');    		
    	}
    	i++;
    }
    while (j < tareasDB.length) { 		
           if (getEstado(j) == 'pendiente' && (getFechaVencimiento(j) == "" || fecha < getFechaVencimiento(j) )) {
            $('#pgPrincipal .lista-tarea').append(
                '<li ' + 'onclick="navSaltar(\'pgEditarTarea\',' + getId(j) + ')">Tarea: ' + getTitulo(j) + '</li>');
        }
        j++;
    }
}

function refrescarNuevaTarea() {
    console.log('refrescarNuevaTarea()');
    $('#pgNuevaTarea #txtTitulo').val('');
    $('#pgNuevaTarea #vencimiento').val('');
}

function refrescarEditarTarea(id) {
    console.log('refrescarEditarTarea(' + id + ')');
    if (!id)
        return;
    var tarea = buscarTarea(id);
    if (!tarea) {
        alert('error, tarea con id ' + id + ' no existe');
        return;
    }
    // detalles tarea
    var html = '<legend>Tarea: ' + getTitulo(id) + '</legend>';
    var fechaVencimiento = getFechaVencimiento(id);
    if (fechaVencimiento!= ""){
    	var date = fechaVencimiento;
    	 html += '<p class="' + getEstado(id) + '">' + getEstado(id) + '</p><p class="' + getEstado(id) + '">' + fechaVencimiento + '</p>';
    }
    else{
    	var date = new Date(getTs(id));   
    	 html += '<p class="' + getEstado(id) + '">' + getEstado(id) + '</p><p class="' + getEstado(id) + '">' + [date.getDate(), date.getMonth() + 1, date.getFullYear()]
        .join("/") + '</p>';
    }

   
   /* html += '<p class="' + getEstado(id) + '">' + getEstado(id) + '</p><p class="' + getEstado(id) + '">' + [date.getDate(), date.getMonth() + 1, date.getFullYear()]
        .join("/") + '</p>';*/
    $('#pgEditarTarea .content fieldset').html(html);
    // botón completar	

    html = getEstado(id) == 'pendiente' ? '<a id="btCompletar"' + 'onclick="completarTarea(' + id + '); navAtras();" class="boton"' + ' href="#">Completar</a>' : '';
    // botón eliminar
    html += '<a id="btEliminar" onclick="eliminarTarea(' + id + '); navAtras();"' + ' class="boton" href="#">Eliminar</a>'
    $('#pgEditarTarea .footer').html(html);
}

function refrescarTodasTareas() {
    console.log('refrescarTodasTareas()');
    $('#pgTodasTareas .lista-tarea').empty();
    // filtrar
    var pendientes = $('#pgTodasTareas #chkPendientes').is(":checked");
    var completadas = $('#pgTodasTareas #chkCompletadas').is(":checked");
    var fecha = $('#pgTodasTareas #txtFecha').val();
    
    try {
        fecha = fecha && fecha.split('/');
        fecha = new Date(fecha[2], fecha[1] - 1, fecha[0]);
    } catch (e) {
        console.log('Fecha no valida');
    }
    console.log('pendientes:' + pendientes + ',completadas:' + completadas + ',fecha:' + fecha);
    for (var i = 0; i < tareasDB.length; i++) {
    	 var fechaActual = new Date();
    	fechaActual = fechaActual.getDate() + "/" + (fechaActual.getMonth() +1) + "/" +fechaActual.getFullYear();
    	var fechaVencimiento = getFechaVencimiento(i);
    	if(fechaVencimiento!="" && (fechaActual>fechaVencimiento)){
    		console.log("fecha actual="+fechaActual + " fecha Vencimiento:"+fechaVencimiento + " resultado de comparación fechaActual>fechavencimiento= " + fechaActual>fechaVencimiento);
    		setEstado(i,"vencida");
    		 $('#pgTodasTareas .lista-tarea').append(
            '<li class="' + getEstado(i) + '" onclick="navSaltar(\'pgEditarTarea\',' + getId(i) + ')">Tarea: ' + getTitulo(i) + '</li>');
    		 continue;
    	}

        if (getEstado(i) == 'pendiente' && !pendientes)
            continue;
        if (getEstado(i) == 'completada' && !completadas)
            continue;
        if (fecha && new Date(getTs(i)) < fecha.getTime())
            continue;
        $('#pgTodasTareas .lista-tarea').append(
            '<li class="' + getEstado(i) + '" onclick="navSaltar(\'pgEditarTarea\',' + getId(i) + ')">Tarea: ' + getTitulo(i) + '</li>');
    }
}
