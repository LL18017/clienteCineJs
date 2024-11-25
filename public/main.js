const URL = "http://localhost:9080/cine-1.0-SNAPSHOT/v1/tipoproducto";
import {findRange,create,findById,update,deleted} from './rest.js';

const tbody=document.getElementById("tbBody")
const tableContainer=document.getElementById("tableContainer")
const opciones=document.getElementById("opciones")
const formContainer=document.getElementById("formContainer")
const btnCancelar=document.getElementById("btnCancelar")
const btnNuevo=document.getElementById("btnNuevo")
const btnCrear=document.getElementById("btnCrear")
const btnModificar=document.getElementById("btnModificar")
const btnEliminar=document.getElementById("btnEliminar")
const inputId=document.getElementById("inputId")
const inputNombre=document.getElementById("inputNombre")
const chkActivo=document.getElementById("chkActivo")
const inputComentarios=document.getElementById("inputComentarios")

const mostrarElemento=(el)=>{
  el.classList.remove('d-none'); 
  el.classList.add('d-block'); 
}
const ocultarElemento=(el)=>{
  el.classList.add('d-none'); 
  el.classList.remove('d-block'); 
}


const eventRegistro=(registro)=>{
  mostrarElemento(formContainer)
  inputId.value=registro.idTipoProducto
  inputNombre.value=registro.nombre
  inputComentarios.value=registro.comentarios
  chkActivo.checked=registro.activo
  ocultarElemento(btnCrear)
  mostrarElemento(btnModificar)
  mostrarElemento(btnEliminar)
  tableContainer.classList.add('d-none');
}
const cancelar=()=>{
  ocultarElemento(formContainer)
  tableContainer.classList.remove('d-none');
  crearBody();
}
const nuevo=()=>{
  mostrarElemento(formContainer)
  inputId.value=""
  inputNombre.value=""
  inputComentarios.value=""
  chkActivo.checked=false

  mostrarElemento(btnCrear);
  ocultarElemento(btnModificar)
  ocultarElemento(btnEliminar)
  tableContainer.classList.add('d-none');
}


btnCancelar.addEventListener("click",cancelar)
btnNuevo.addEventListener("click",nuevo)
opciones.addEventListener('change', (e) => {
  const selectedValue = e.target.value;

  crearBody(0, selectedValue);
});
const crearBody=async (first,max)=>{
    
    
    const listRegistos = await findRange(URL,first,max);   
    console.log(listRegistos);
    
    if (listRegistos.length > 0) {
      tbody.innerHTML = '';
        listRegistos.forEach(element => {
            const fila = document.createElement('tr');
            fila.addEventListener("click",()=>eventRegistro(element))
            
            const id = document.createElement('td');
            const nombre = document.createElement('td');
            const comentario = document.createElement('td');
            const activo = document.createElement('td');
    
            id.textContent = element.idTipoProducto;
            nombre.textContent = element.nombre;
            comentario.textContent = element.comentarios;
            activo.textContent = element.activo?"ACTIVO":"INACTIVO";
    
            fila.appendChild(id);
            fila.appendChild(nombre);
            fila.appendChild(comentario);
            fila.appendChild(activo);
    
            tbody.appendChild(fila);
        });
    }

   
   
    

}

crearBody(null,null)

// Función para mostrar alertas dinámicas
function mostrarAlerta(tipo, mensaje) {
  // Tipos: 'success', 'warning', 'danger', 'info'
  const alertContainer = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  
  alert.className = `alert alert-${tipo} alert-dismissible fade show`; // Clases de Bootstrap
  alert.role = "alert";
  alert.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  alertContainer.appendChild(alert);

  setTimeout(() => {
      alert.classList.remove('show'); 
      alert.addEventListener('transitionend', () => alert.remove()); 
  }, 3000); 
}


btnCrear.addEventListener("click",async (e)=>{
  e.preventDefault();
  const registro={
    nombre:inputNombre.value,
    activo:chkActivo.checked,
    comentarios:inputComentarios.value
  }
  const status=await create(URL,registro)
  if (status!==201) {
    mostrarAlerta('danger', '¡Producto no se pudo crear!');
  }
  mostrarAlerta('success', '¡Producto creado con éxito!');
  crearBody(null,null)
  cancelar()
})

btnModificar.addEventListener("click",async (e)=>{
  e.preventDefault();
  const registro={
    idTipoProducto:inputId.value,
    nombre:inputNombre.value,
    activo:chkActivo.checked,
    comentarios:inputComentarios.value
  }
  const status=await update(URL,registro)
  if (status!==200) {
    mostrarAlerta('danger', '¡Producto no se pudo modificar!');
  }
  mostrarAlerta('info', '¡Producto modificado con éxito!');
  crearBody(null,null)
  cancelar()
})
btnEliminar.addEventListener("click",async (e)=>{
  e.preventDefault();
  const registro={
    idTipoProducto:inputId.value,
    nombre:inputNombre.value,
    activo:chkActivo.checked,
    comentarios:inputComentarios.value
  }
  const status=await deleted(URL,registro)
  if (status!==200) {
    mostrarAlerta('danger', '¡Producto no se pudo eliminar!');
  }
  mostrarAlerta('info', '¡Producto eliminado con éxito!');
  crearBody(null,null)
  cancelar()
})

// Crear una nueva conexión WebSocket con el servidor
const socket = new WebSocket('ws://localhost:9080/cine-1.0-SNAPSHOT/notificadorws'); // Reemplaza la URL si es necesario

// Evento que se ejecuta cuando la conexión WebSocket se establece
socket.onopen = function(event) {
    console.log('Conexión WebSocket abierta');
};

// Evento que se ejecuta cuando se recibe un mensaje del servidor WebSocket
socket.onmessage = function(event) {
 
    if (event.data==="nuevo dato guardado") {
        if (!tableContainer.classList.contains("d-none")) {

          crearBody();
          mostrarAlerta("info","se ha actualizado la base de datos")
          return
        }
    }else if (event.data==="nuevo dato modificado") {
      if (!tableContainer.classList.contains("d-none")) {
        crearBody();
        mostrarAlerta("info","se ha actualizado la base de datos")
        return
      }
    }else if (event.data==="nuevo dato eliminado") {
      if (!tableContainer.classList.contains("d-none")) {
        crearBody();
        mostrarAlerta("info","se ha actualizado la base de datos")
        return
      }
    }
    mostrarAlerta("warning","se ha actualizado la base de datos");
   
};

// Evento que se ejecuta cuando ocurre un error en la conexión WebSocket
socket.onerror = function(event) {
    console.error('Error en la conexión WebSocket:', event);
};

// Evento que se ejecuta cuando la conexión WebSocket se cierra
socket.onclose = function(event) {
    console.log('Conexión WebSocket cerrada');
};
