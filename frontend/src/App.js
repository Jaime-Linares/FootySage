import React, { useEffect, useState } from 'react';
import CustomButton from './components/CustomButton';
import CustomTextInput from './components/CustomTextInput';
import Logo from './components/Logo';
import FootballLogo from './components/FootballLogo';


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
      {/* Prueba Logo */}
      <div>
        <Logo variant="footysage_black" width="150px" />
        <Logo variant="footysage_white" width="150px" />
        <Logo variant="statsbomb_red" height="40px" style={{ marginTop: '20px' }} />
        <Logo variant="statsbomb_white" height="40px" style={{ marginTop: '20px' }} />
        <Logo variant="statsbomb_black" height="40px" style={{ marginTop: '20px' }} />
      </div>
      {/* Prueba FootballLogo */}
      <div>
        <FootballLogo
          src="https://media.api-sports.io/football/leagues/140.png"
          alt="La Liga"
        />
        <FootballLogo
          src="https://media.api-sports.io/football/teams/536.png"
          alt="Sevilla FC"
        />
      </div>
    </div>
  );
}

export default App;
