let registros=0;
async function findRange(URL, params) {
  // Construir la cadena de consulta a partir del objeto params
  const queryParams = new URLSearchParams(params).toString();
  const fullURL = queryParams ? `${URL}?${queryParams}` : URL;
  
  console.log('URL construida:', fullURL);
  
  try {
      const respuesta = await fetch(fullURL, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          mode: 'cors'
      });
    
      if (!respuesta.ok) {
          throw new Error('Error en la solicitud');
      }

      const registros = respuesta.headers.get('Total-records');
      console.log('Total de registros:', registros);

      const datos = await respuesta.json();
      
      return datos;  // Retorna los datos
  } catch (error) {
      console.error(error);
      return [];  // En caso de error, retorna un array vacío
  }
}




  async function findById(URL,id) {
    try {
      const respuesta = await fetch(`${URL}/${id}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }});
      
      if (!respuesta.ok) {
        throw new Error('Error en la solicitud');
      }
  
      const datos = await respuesta.json();
      return datos;  // Retorna los datos
    } catch (error) {
      console.error('Hubo un error:', error);
      return null;  // Retorna null en caso de error
    }
  }


  async function findRangeById(URL,id) {
    if (id!=null) {
          URL=`${URL}/${id}`
          console.log(URL);
          
    }
    try {
      const respuesta = await fetch(URL,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors' 
      });
      
      if (!respuesta.ok) {
        throw new Error('Error en la solicitud');
      }

      registros = respuesta.headers.get('Total-records');
      console.log('Total de registros:', registros);  
  
      const datos = await respuesta.json();
      return datos;  // Retorna los datos
    } catch (error) {
      return [];  // Retorna null en caso de error
    }
  }

  async function create(URL,registro) {
    
    try {
      const respuesta = await fetch(`${URL}`,{
        method: 'POST',
        body:JSON.stringify(registro),
        headers: {
          'Content-Type': 'application/json'
        }});
      
      if (!respuesta.ok) {
        throw new Error('Error en la solicitud');
      }
      const guardado =  respuesta.headers.get("Location");
      
      return guardado;  // Retorna los datos
    } catch (error) {
      console.error('Hubo un error:', error);
      return null;  // Retorna null en caso de error
    }
  }

  async function update(URL,registro) {
    try {
      const respuesta = await fetch(`${URL}`,{
        method: 'PUT',
        body:JSON.stringify(registro),
        headers: {
          'Content-Type': 'application/json'
        }});
      
      if (!respuesta.ok) {
        throw new Error('Error en la solicitud');
      }
  
      return respuesta.status;  
    } catch (error) {
      console.error('Hubo un error:', error);
      return null;  // Retorna null en caso de error
    }
  }

  async function deleted(URL,registro) {
    try {
      const respuesta = await fetch(`${URL}`,{
        method: 'DELETE',
        body:JSON.stringify(registro),
        headers: {
          'Content-Type': 'application/json'
        }});
      
      if (!respuesta.ok) {
        throw new Error('Error en la solicitud');
      }
      return respuesta.status;  
    } catch (error) {
      console.error('Hubo un error:', error);
      return null;  // Retorna null en caso de error
    }
  }


  export {create,findById,findRange,update,deleted,findRangeById,registros}