import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Plot from 'react-plotly.js';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import Logo from '../../components/Logo';
import FootballLogo from '../../components/FootballLogo';
import SelectDropdown from '../../components/CustomSelectDropdown';
import MatchCard from '../../components/MatchCard';
import CustomModal from '../../components/CustomModal';


const GraficoEChartsInline = () => {
  const datos = {
    labels: ['Barcelona', 'Real Madrid', 'Atlético', 'Sevilla'],
    goles: [82, 76, 65, 59],
  };

  const opciones = {
    title: {
      text: 'Goles por equipo (mock)',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    toolbox: {
      feature: {
        dataZoom: {},
        saveAsImage: {},
        restore: {},
      },
    },
    xAxis: {
      type: 'category',
      data: datos.labels,
    },
    yAxis: {
      type: 'value',
      name: 'Goles',
    },
    series: [
      {
        name: 'Goles',
        type: 'bar',
        data: datos.goles,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return <ReactECharts option={opciones} style={{ height: 400, width: '100%' }} />;
};

const GraficoPlotlyInline = () => {
  const datos = {
    labels: ['Barcelona', 'Real Madrid', 'Atlético', 'Sevilla'],
    goles: [82, 76, 65, 59],
  };

  return (
    <Plot
      data={[
        {
          x: datos.labels,
          y: datos.goles,
          type: 'bar',
          marker: { color: 'skyblue' },
          hoverinfo: 'x+y',
        },
      ]}
      layout={{
        title: 'Goles por equipo (mock)',
        xaxis: { title: 'Equipo' },
        yaxis: { title: 'Goles' },
        margin: { t: 60, l: 50, r: 30, b: 50 },
        autosize: true,
        responsive: true,
      }}
      style={{ width: '100%', height: '400px' }}
      config={{
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['sendDataToCloud'],
        responsive: true,
      }}
    />
  );
};

const Check = () => {
  const mensaje = 'Hola desde el backend!';
  const leagues = [
    { label: 'Premier League', value: 'premier', image: 'https://media.api-sports.io/football/leagues/39.png' },
    { label: 'La Liga', value: 'laliga', image: 'https://media.api-sports.io/football/leagues/140.png' },
    { label: 'Premier League1', value: 'premier1', image: 'https://media.api-sports.io/football/leagues/39.png' },
    { label: 'La Liga1', value: 'laliga1', image: 'https://media.api-sports.io/football/leagues/140.png' },
    { label: 'Premier League2', value: 'premier2', image: 'https://media.api-sports.io/football/leagues/39.png' },
    { label: 'La Liga2', value: 'laliga2', image: 'https://media.api-sports.io/football/leagues/140.png' },
    { label: 'Premier League3', value: 'premier3', image: 'https://media.api-sports.io/football/leagues/39.png' },
    { label: 'La Liga3', value: 'laliga3', image: 'https://media.api-sports.io/football/leagues/140.png' },
    { label: 'Serie A', value: 'seriea' },
  ];
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* Prueba conexión backend */}
      <div>
        <h1>Pruebas en FootySage</h1>
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
      {/* Gráfico de prueba con ECharts */}
      <div style={{ marginTop: '60px', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center' }}>Gráfico interactivo: Goles por equipo</h2>
        <GraficoEChartsInline />
      </div>
      {/* Gráfico de prueba con Plotly */}
      <div style={{ marginTop: '60px', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center' }}>Gráfico interactivo: Goles por equipo (Plotly)</h2>
        <GraficoPlotlyInline />
      </div>
    </div>
  );
};


export default Check;
