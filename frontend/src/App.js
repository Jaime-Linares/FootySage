import React, { useEffect, useState } from 'react';
import CustomButton from './components/CustomButton';
import CustomTextInput from './components/CustomTextInput';
import Logo from './components/Logo';
import FootballLogo from './components/FootballLogo';
import SelectDropdown from './components/CustomSelectDropdown';


function App() {
  const [mensaje, setMensaje] = useState('');
  const leagues = [
    { label: 'Premier League', value: 'premier', image: 'https://media.api-sports.io/football/leagues/39.png' },
    { label: 'La Liga', value: 'laliga', image: 'https://media.api-sports.io/football/leagues/140.png' },
    { label: 'Premier League1', value: 'premier1', image: 'https://media.api-sports.io/football/leagues/39.png' },
    { label: 'La Liga1', value: 'laliga1', image: 'https://media.api-sports.io/football/leagues/140.png' },
    { label: 'Premier Leagu2e', value: 'premier2', image: 'https://media.api-sports.io/football/leagues/39.png' },
    { label: 'La Liga2', value: 'laliga2', image: 'https://media.api-sports.io/football/leagues/140.png' },
    { label: 'Premier League3', value: 'premier3', image: 'https://media.api-sports.io/football/leagues/39.png' },
    { label: 'La Liga3', value: 'laliga3', image: 'https://media.api-sports.io/football/leagues/140.png' },
    { label: 'Serie A', value: 'seriea' },
  ];

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
      {/* Prueba CustomSelectDropdown */}
      <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '50px' }}>
        <SelectDropdown
          options={leagues}
          multi={true}
          onChange={(selected) => console.log(selected)}
          placeholder="Select leagues"
        />
      </div>
    </div>
  );
}

export default App;
