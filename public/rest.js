let registros=0;

async function findRange(URL,first, max,all) {
    if (first!=null && max!=null && first>=0 && max>first) {
          URL=`${URL}?first=${first}&max=${max}`
          console.log(URL);
          
    }else if (all) {
      URL=`${URL}?all=${all}`
    }
    try {
      const respuesta = await fetch(URL,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }});
      
      if (!respuesta.ok) {
        throw new Error('Error en la solicitud');
      }

      registros = respuesta.headers.get('Total-records');
      console.log('Total de registros:', registros);  
  
      const datos = await respuesta.json();
    
      
      return datos;  // Retorna los datos
    } catch (error) {
      console.error('Hubo un error:', error);
      return null;  // Retorna null en caso de error
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
      return respuesta.status;  // Retorna los datos
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


  export {create,findById,findRange,update,deleted,registros}