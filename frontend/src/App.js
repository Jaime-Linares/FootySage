import React, { useEffect, useState } from 'react';
import CustomButton from './components/CustomButton';
import CustomTextInput from './components/CustomTextInput';
import Logo from './components/Logo';
import FootballLogo from './components/FootballLogo';
import SelectDropdown from './components/CustomSelectDropdown';
import MatchCard from './components/MatchCard';
import CustomModal from './components/CustomModal';
import Footer from './components/Footer';


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
  const [showModal, setShowModal] = useState(false);

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
      {/* Prueba MatchCard */}
      <br />
      <MatchCard
        matchday={5}
        date="01/04/2025 21:00"
        stadium="Camp Nou"
        homeTeam="FC Barcelona"
        crestUrlHomeTeam="https://media.api-sports.io/football/leagues/140.png"
        awayTeam="Real Madrid"
        crestUrlAwayTeam="https://media.api-sports.io/football/teams/536.png"
        status="finished"
        scoreHome={2}
        scoreAway={1}
        onPress={() => alert('You clicked on a completed match')}
      />
      <br />
      <MatchCard
        matchday={6}
        date="10/04/2025 18:30"
        stadium="Santiago Bernabéu"
        homeTeam="Real Madrid"
        crestUrlHomeTeam="https://media.api-sports.io/football/leagues/140.png"
        awayTeam="Atlético de Madrid"
        crestUrlAwayTeam="https://media.api-sports.io/football/teams/536.png"
        status="scheduled"
      />
      {/* Prueba CustomModal */}
      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
        <CustomButton title="Open Modal" onPress={() => setShowModal(true)} />
        <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
          <h2 style={{ marginTop: 0 }}>This is a modal!</h2>
          <p>You can put any content here.</p>
        </CustomModal>
    </div>
    <br />
    <Footer />
    </div>
  );
}


export default App;
