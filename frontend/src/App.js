import React, { useEffect, useState } from 'react';
import CustomButton from './components/CustomButton';
import CustomTextInput from './components/CustomTextInput';


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
      {/* Prueba conexión backend */}
      <div>
        <h1>FootySage Frontend</h1>
        <p>Mensaje desde el backend: {mensaje}</p>
      </div>
      {/* Prueba CustomButton */}
      <div>
        <CustomButton
          title="Iniciar sesión"
          onPress={() => console.log('Login')}
        />
      </div>
      {/* Prueba CustomTextInput */}
      <div style={{ width: '300px', margin: '50px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <CustomTextInput
          placeholder="Email"
        />
        <CustomTextInput
          placeholder="Password"
          showPasswordToggle
        />
      </div>
    </div>
  );
}

export default App;
