const fechaProgramacion = document.getElementById("fechaProgramacion");
const SalaSOM = document.getElementById("SalaSOM");
const programacionSOM = document.getElementById("programacionSOM");
const ulAsientosDisponibles = document.getElementById("ulAsientosDisponibles");
const ulAsientosSelecionados = document.getElementById("ulAsientosSelecionados");
const btnAgregarAsiento = document.getElementById("btnAgregarAsiento");
const btnEliminarAsiento = document.getElementById("btnEliminarAsiento");
const btnCrearReserva = document.getElementById("btnCrearReserva");
const formReserva = document.getElementById("btnCrearReserva");

import {findRange,findRangeById,create,findById,update,deleted} from './rest.js';

let listAsientosSelecionados=[]
const hoy = new Date();

// Restar 6 horas
hoy.setHours(hoy.getHours());

document.addEventListener('click', (event) => {
    if (!ulAsientosDisponibles.contains(event.target)) {
        const asitD = ulAsientosDisponibles.getElementsByTagName("li");
        const asitS = ulAsientosSelecionados.getElementsByTagName("li");
        Array.from(asitD).forEach(item => item.classList.remove("active"));
        Array.from(asitS).forEach(item => item.classList.remove("active")
        );
    }

    btnAgregarAsiento.setAttribute("disabled",true)
    btnEliminarAsiento.setAttribute("disabled",true)
});

btnAgregarAsiento.addEventListener("click", (event) => {
    btnAgregarAsiento.setAttribute("disabled", true);
    const activeLi = ulAsientosDisponibles.getElementsByClassName("active")[0];
    const asiento={
        "id":activeLi.getAttribute("id"),
        "nombre":activeLi.innerHTML
    }
    listAsientosSelecionados.push(asiento)
    activeLi.classList.remove("active")
    if (activeLi) {
        ulAsientosSelecionados.appendChild(activeLi);  
    }

    btnCrearReserva.removeAttribute("disabled")
});

btnEliminarAsiento.addEventListener("click", (event) => {
    const activeLi = ulAsientosSelecionados.getElementsByClassName("active")[0];
    const asiento={
        "id":activeLi.getAttribute("id"),
        "nombre":activeLi.innerHTML
    }


    listAsientosSelecionados=listAsientosSelecionados.filter(element => element.id !== asiento.id);
    activeLi.classList.remove("active")
    if (activeLi) {
        ulAsientosDisponibles.appendChild(activeLi);  
    }

    if (listAsientosSelecionados.length==0) {
        btnCrearReserva.setAttribute("disabled",true)
    }
    
});

// Formatear la fecha y hora en formato YYYY-MM-DDTHH:mm
const año = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
const día = String(hoy.getDate()).padStart(2, '0');
const hora = String(hoy.getHours()).padStart(2, '0');
const minutos = String(hoy.getMinutes()).padStart(2, '0');

// Construir el formato para datetime-local
const fechaHoraFormateada = `${año}-${mes}-${día}T${hora}:${minutos}`;

// Asignar la fecha y hora formateada al valor del input
fechaProgramacion.value = fechaHoraFormateada;
fechaProgramacion.min = fechaHoraFormateada;



const URL_BASE="http://localhost:9080/cine-1.0-SNAPSHOT/v1/";


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

// Crear una nueva conexión WebSocket con el servidor
const socket = new WebSocket('ws://localhost:9080/cine-1.0-SNAPSHOT/notificadorreserva'); 

// Evento que se ejecuta cuando la conexión WebSocket se establece
socket.onopen = function(event) {
    socket.send('Conexión WebSocket desde frontend');
};

// Evento que se ejecuta cuando se recibe un mensaje del servidor WebSocket
socket.onmessage = function(event) {
    const mensaje=event.data.split(":")[0]
    const id=event.data.split(":")[1]
   
    const coincidencias= listAsientosSelecionados.filter(a=>a.id==`asientoId-${id}`)
      
    if (mensaje==="se ha guardado el asiento" && coincidencias.length>0) {
          
          mostrarAlerta("warning","alguien ha reservado tu asiento")
          buscarAsientos()
          return
    }else if (event.data==="se ha eliminado el asiento") {
      if (!tableContainer.classList.contains("d-none")) {
        crearBody(null);
        mostrarAlerta("info","tu asiento ya no existe")
        return
      }
    }
   if (mensaje=="se selecciono el asiento" && coincidencias.length>0) {
    mostrarAlerta("warning",`alguien ha selecionado el asiento ${id}`);
   }
   
   
};

// Evento que se ejecuta cuando ocurre un error en la conexión WebSocket
socket.onerror = function(event) {
    console.error('Error en la conexión WebSocket:', event);
};


const crearBody=async(params)=>{
    const listSalas= await findRange(`${URL_BASE}sala`,params)
    if (listSalas.length > 0) {
        SalaSOM.innerHTML = '';
        listSalas.forEach(element => {
              const option = document.createElement('option');
              option.value = element.idSala;
              option.textContent = element.nombre
              SalaSOM.appendChild(option);
          });

          SalaSOM.value = listSalas[0].idSala;
          buscarProgramaciones();

        
      }


}

SalaSOM.addEventListener('change',()=>buscarProgramaciones());


const buscarProgramaciones=async () => {
    ulAsientosDisponibles.innerHTML=""
    ulAsientosSelecionados.innerHTML=""
    btnCrearReserva.setAttribute("disabled",true)
    const listaProgramaciones=await findRangeById(`${URL_BASE}programacion/sala`,SalaSOM.value);
    if (listaProgramaciones.length > 0) {
        programacionSOM.innerHTML = '';
        listaProgramaciones.forEach(element => {
              const option = document.createElement('option');
              option.value = element.idProgramacion;
              option.textContent = element.formattedLabel
              programacionSOM.removeAttribute('disabled')
              programacionSOM.appendChild(option);


          });
          
          programacionSOM.value=listaProgramaciones[0].idProgramacion
          buscarAsientos()
        
      }else{
        const option = document.createElement('option');
        option.textContent = "ho hay progrmaciones disponibles"
        programacionSOM.innerHTML=""
        ulAsientosDisponibles.innerHTML=""
        programacionSOM.appendChild(option);
        programacionSOM.setAttribute("disabled",true)
        
      }
  }

  programacionSOM.addEventListener('change',()=>buscarAsientos());

const buscarAsientos=async ()=>{
     ulAsientosDisponibles.innerHTML=""
    ulAsientosSelecionados.innerHTML=""
    btnCrearReserva.setAttribute("disabled",true)
    console.log("hola");
    const params = {
        idSala: SalaSOM.value,
        idProgramacion: programacionSOM.value
    };
    const listaAsientos=await findRange(`${URL_BASE}asiento/libres`,params);

    if (listaAsientos.length > 0) {
        // Limpiar la lista antes de agregar nuevos asientos
        listaAsientos.forEach(element => {
            const li = document.createElement('li');
            li.classList.add("list-group-item");
            li.setAttribute("id", `asientoId-${element.idAsiento}`);
            li.innerText = element.nombre;
    
            li.addEventListener("click", ()=>eventoAsiento(event,li));
    
            ulAsientosDisponibles.appendChild(li);  // Agregar el <li> al contenedor de asientos disponibles
        });
    }
    
}

const eventoAsiento=(event,li) => {
    btnAgregarAsiento.setAttribute("disabled", true);
    btnEliminarAsiento.setAttribute("disabled", true);
    event.stopPropagation();  // Evitar que el click se propague

    // Obtener todos los <li> de los asientos disponibles y seleccionados
    const asientoD = ulAsientosDisponibles.getElementsByTagName("li");
    const asientoS = ulAsientosSelecionados.getElementsByTagName("li");

    // Eliminar la clase 'active' de todos los asientos en disponibles y seleccionados
    Array.from(asientoD).forEach(item => {
        item.classList.remove("active");
    });
    Array.from(asientoS).forEach(item => {
        item.classList.remove("active");
    });

    // Marcar el asiento clickeado como activo
    li.classList.add("active");

    // Comprobar si el asiento ya está seleccionado en la lista de asientos seleccionados
    let yaSeleccionado = false;
    listAsientosSelecionados.forEach(a => {
        if (a.id == li.getAttribute("id")) {
            yaSeleccionado = true;
        }
    });
    if (yaSeleccionado) {
        btnAgregarAsiento.setAttribute("disabled", true);
        btnEliminarAsiento.removeAttribute("disabled")
    }else{
        btnEliminarAsiento.setAttribute("disabled", true);
        btnAgregarAsiento.removeAttribute("disabled");
    
    }

    socket.send(`se ha selecionado el asiento:${li.getAttribute("id")}`)

}

const params = {
    first: null,
    max: null
};



crearBody(null)

btnCrearReserva.addEventListener("click", async (event) => {
    event.preventDefault();
  
    try {
      // Obtener el tipo de reserva
      const tipoReservaList = await findRange(`${URL_BASE}tiporeserva`, null);
      const tipoReserva = tipoReservaList.find((element) => element.nombre === "ONLINE");
  
      if (!tipoReserva) {
        throw new Error("Tipo de reserva 'ONLINE' no encontrado");
      }
  
      console.log(tipoReserva.idTipoReserva);
  
      // Crear la reserva
      const reserva = {
        estado: "creada",
        idProgramacion: {
          idProgramacion: programacionSOM.value,
        },
        idTipoReserva: {
          idTipoReserva: tipoReserva.idTipoReserva,
        },
        fechaReserva:hoy
      };
  
      const url = await create(`${URL_BASE}reserva`, reserva);
      if (!url) {
        throw new Error("No se pudo obtener la URL de la reserva creada");
      }
  
      const reservaGuardada = await findById(url, "");
      console.log(reservaGuardada);
      
      if (!reservaGuardada || !reservaGuardada.idReserva) {
        throw new Error("Reserva guardada inválida o no se obtuvo su ID");
      }
  
      // Crear los detalles de la reserva
      for (const a of listAsientosSelecionados) {
        const reservaDetalle = {
          idReserva: {
            idReserva: reservaGuardada.idReserva,
          },
          idAsiento: {
            idAsiento: a.id.split("-")[1],
          },
          estado: "creado",
        };
        console.log(a);
        
        const reservaDetalleGuardada = await create(`${URL_BASE}reservadetalle`, reservaDetalle);
  
        console.log(`Reserva detalle creada:`, reservaDetalleGuardada);
      }
  
         mostrarAlerta("info","reserva creada exitosamente")
        window.open(`http://localhost:9080/cine-1.0-SNAPSHOT/v1/reporte/tiposala`, '_blank');
        location.reload()

      console.log("Reserva y detalles creados exitosamente");
    } catch (error) {
        
        mostrarAlerta("error","Error al crear la reserva")
      console.error("Error al crear la reserva:", error);
    }
  });
  
