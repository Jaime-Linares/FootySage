import React, { useEffect, useState } from 'react';
import CustomButton from './components/CustomButton';


function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/hello/')
      .then(res => res.json())
      .then(data => setMensaje(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <div>
        <h1>FootySage Frontend</h1>
        <p>Mensaje desde el backend: {mensaje}</p>
      </div>
      <div>
        <CustomButton
          title="Iniciar sesión"
          onPress={() => console.log('Login')}
          color="red"
        />
      </div>
    </div>
  );
}

export default App;
