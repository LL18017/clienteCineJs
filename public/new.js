const fechaProgramacion = document.getElementById("fechaProgramacion");
const SalaSOM = document.getElementById("SalaSOM");
const programacionSOM = document.getElementById("fechaProgramacion");
import {findRange,create,findById,update,deleted} from './rest.js';
const hoy = new Date();

// Restar 6 horas
hoy.setHours(hoy.getHours());

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
console.log(fechaHoraFormateada);



const URL_BASE="http://localhost:9080/cine-1.0-SNAPSHOT/v1/";

const crearBody=async(firs,max,all)=>{
    const listSalas= await findRange(`${URL_BASE}sala`,"all")
    if (listSalas.length > 0) {
        SalaSOM.innerHTML = '';
        listSalas.forEach(element => {
              const option = document.createElement('option');
              option.addEventListener("change",()=>salaSelcionada(element))
              option.value = element.idSala;
              option.textContent = element.nombre
      
      
              SalaSOM.appendChild(option);
          });

        
      }

}
SalaSOM.addEventListener('change', () => {
    const salaSeleccionada = SalaSOM.value; // ID de la sala seleccionada
    console.log(`Sala seleccionada: ${salaSeleccionada}`);
  });

const salaSelcionada=(sala)=>{
    console.log("hola");
    
}

crearBody(null,null,"all")