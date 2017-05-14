var nextId = 0;

var tareasDB = sessionStorage;

function Tarea(titulo) {
	this.id = nextId++;
	this.titulo = titulo;
	this.estado = 'pendiente';
	this.ts = new Date().getTime();
}

/* crea una nueva tarea en la bd */
function nuevaTarea(title) {
	console.log('nuevaTarea(' + title + ')');
	var tarea = new Tarea(title);
	console.log(tarea);
	tareasDB.setItem(tarea.id, JSON.stringify(tarea));
	return tarea;
}
/* busca una tarea en la bd */
function buscarTarea(id) { ///// TODO MODIFICAR
	console.log('buscarTarea(' + id + ')');
		if (tareasDB.key(id)!= null){
			console.log("tarea encontrada" + JSON.parse(tareasDB.getItem(tareasDB.key(id))));
			return JSON.parse(tareasDB.getItem(tareasDB.key(id)));
		}		
		
	return null;
}
/* completa una tarea */
function completarTarea(id) {
	console.log('completarTarea(' + id + ')');
	setEstado(id,"completada");
		
}
/* elimina una tarea de la bd */
function eliminarTarea(id) {
	console.log('eliminarTarea(' + id + ')');
	tareasDB.removeItem(id);
	return;
}


function getId(id){
	var tarea = buscarTarea(id);
	if(tarea!=null)
	return tarea.id;
	return null;
}


function getTitulo(id){
	var tarea = buscarTarea(id);
	if(tarea!=null)
	return tarea.titulo;
	return null;
}

function getEstado(id){
	var tarea = buscarTarea(id);
	if(tarea!=null)
	return tarea.estado;
	return null;

}

function getTs(id){
	var tarea = buscarTarea(id);
	if(tarea!=null)
	return tarea.ts;
	return null;
}

function setTitulo(id, titulo){
	var tarea = buscarTarea(id);
	if(tarea!=null){
		tarea.titulo = titulo;
		tareasDB.setItem(id, JSON.stringify(tarea));
	}
	
}

function setEstado(id, estado){
	var tarea = buscarTarea(id);
	if(tarea!=null){
		tarea.estado = estado;
		tareasDB.setItem(id, JSON.stringify(tarea));
	}	
}

function setTs(id, ts){
	var tarea = buscarTarea(id);
	if(tarea!=null){
		tarea.ts = ts;
		tareasDB.setItem(id, JSON.stringify(tarea));
	}	
}




