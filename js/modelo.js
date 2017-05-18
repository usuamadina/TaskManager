var nextId = 0;

var tareasDB = sessionStorage;

function Tarea(titulo, vencimiento) {
    this.id = nextId++;
    this.titulo = titulo;
    this.estado = 'pendiente';
    this.ts = new Date().getTime();
    if (vencimiento == "") {
        this.vencimiento = "";
    } else {
        var fecha_aux = vencimiento.split("-").reverse();
        var fecha = new Date(parseInt(fecha_aux[2]), parseInt(fecha_aux[1] - 1), parseInt(fecha_aux[0]));
        this.vencimiento = fecha.getTime();
    }


}

/* crea una nueva tarea en la bd */
function nuevaTarea(title, vencimiento) {
    //console.log('nuevaTarea(' + title + ')');	
    var tarea = new Tarea(title, vencimiento);
    console.log(tarea);
    tareasDB.setItem(tarea.id, JSON.stringify(tarea));
    return tarea;
}

/* busca una tarea en la bd */
function buscarTarea(id) {
    //console.log('buscarTarea(' + id + ')');
    if (tareasDB.key(id) != null) {
        console.log("tarea encontrada" + JSON.parse(tareasDB.getItem(tareasDB.key(id))));
        return JSON.parse(tareasDB.getItem(tareasDB.key(id)));
    }

    return null;
}
/* completa una tarea */
function completarTarea(id) {
    //console.log('completarTarea(' + id + ')');
    setEstado(id, "completada");

}
/* elimina una tarea de la bd */
function eliminarTarea(id) {
    //console.log('eliminarTarea(' + id + ')');
    tareasDB.removeItem(id);
    return;
}


function getId(id) {
    var tarea = buscarTarea(id);
    if (tarea != null)
        return tarea.id;
    return null;
}


function getTitulo(id) {
    var tarea = buscarTarea(id);
    if (tarea != null)
        return tarea.titulo;
    return null;
}

function getEstado(id) {
    var tarea = buscarTarea(id);
    if (tarea != null)
        return tarea.estado;
    return null;

}

function getFechaVencimiento(id) {
    var tarea = buscarTarea(id);
    if (tarea != null)
        return tarea.vencimiento;
    return null;
}

function getTs(id) {
    var tarea = buscarTarea(id);
    if (tarea != null)
        return tarea.ts;
    return null;
}

function setTitulo(id, titulo) {
    var tarea = buscarTarea(id);
    if (tarea != null) {
        tarea.titulo = titulo;
        tareasDB.setItem(id, JSON.stringify(tarea));
    }

}

function setEstado(id, estado) {
    var tarea = buscarTarea(id);
    if (tarea != null) {
        tarea.estado = estado;
        tareasDB.setItem(id, JSON.stringify(tarea));
    }
}

function setTs(id, ts) {
    var tarea = buscarTarea(id);
    if (tarea != null) {
        tarea.ts = ts;
        tareasDB.setItem(id, JSON.stringify(tarea));
    }
}
