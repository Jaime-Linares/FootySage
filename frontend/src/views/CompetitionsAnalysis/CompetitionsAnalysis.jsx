import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import FootballLogo from '../../components/FootballLogo';
import MessageBanner from '../../components/MessageBanner';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FeatureImportanceChart from './FeatureImportanceChart';
import './styles/CompetitionsAnalysis.css';


const LEAGUES = [
  { id: 'LaLiga', name: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 'PremierLeague', name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 'SerieA', name: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: 'Ligue1', name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  { id: '1Bundesliga', name: '1. Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { id: 'Top5', name: 'Las cinco grandes ligas', logo: 'https://e7.pngegg.com/pngimages/463/615/png-clipart-europe-map-map-world-map.png' },
];

const CompetitionsAnalysis = () => {
  const { accessToken } = useAuth();
  const [selectedLeague, setSelectedLeague] = useState('LaLiga');
  const [chartsData, setChartsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState({ message: '', type: '' });

  const fetchLeagueData = useCallback(async (league) => {
    setChartsData([]);
    setCurrentIndex(0);
    setMessage({ message: '', type: '' });
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/global_feature_importance/?league=${league}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setChartsData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage({ message: 'Debes iniciar sesión para ver este análisis', type: 'error' });
      } else {
        setMessage({ message: 'Error al cargar los datos. Inténtalo más tarde', type: 'error' });
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    fetchLeagueData(selectedLeague);
  }, [selectedLeague, accessToken, fetchLeagueData]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % chartsData.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + chartsData.length) % chartsData.length);

  const renderChart = () => {
    const current = chartsData[currentIndex];
    const data = current.importances || chartsData;
    const isLogistic = Array.isArray(current.importances);
    const competitionName = LEAGUES.find(l => l.id === selectedLeague)?.name;

    return (
      <FeatureImportanceChart
        data={data}
        title={
          isLogistic
            ? `${competitionName} - Influencia global de las características: ${current.class}`
            : `${competitionName} - Influencia global de las características`
        }
        type={isLogistic ? 'logistic' : 'random_forest'}
      />
    );
  };

  return (
    <div className="competitions-analysis-container competitions-analysis-fade-in">
      <h1 className="competitions-analysis-title">Análisis de competiciones</h1>
      <MessageBanner message={message.message} type={message.type} />

      <div className="tabs-leagues">
        {LEAGUES.map((league) => (
          <div
            key={league.id}
            className={`tab-league ${selectedLeague === league.id ? 'tab-league-selected' : ''}`}
            onClick={() => setSelectedLeague(league.id)}
          >
            <FootballLogo src={league.logo} alt={league.name} />
            <span>{league.name}</span>
          </div>
        ))}
      </div>

      {!message.message && chartsData.length > 0 && (
        <div className="chart-carousel">
          <CustomButton
            title={<FaChevronLeft color='var(--color-green)' size={60} />}
            onPress={prev}
            buttonStyle={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'var(--color-background)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
            }}
            textStyle={{
              fontSize: '30px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
            disabled={chartsData.length <= 1}
          />
          {renderChart()}
          <CustomButton
            title={<FaChevronRight color='var(--color-green)' size={60} />}
            onPress={next}
            buttonStyle={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'var(--color-background)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px',
            }}
            textStyle={{
              fontSize: '30px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
            disabled={chartsData.length <= 1}
          />
        </div>
      )}
    </div>
  );
};


export default CompetitionsAnalysis;
