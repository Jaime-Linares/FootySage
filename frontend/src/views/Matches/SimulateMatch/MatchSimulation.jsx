import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import CustomButton from '../../../components/CustomButton';
import MessageBanner from '../../../components/MessageBanner';
import MatchHeader from './MatchHeader';
import './styles/MatchSimulation.css';


const LEAGUES = [
  { id: 'LaLiga', name: 'La Liga' },
  { id: 'PremierLeague', name: 'Premier League' },
  { id: 'SerieA', name: 'Serie A' },
  { id: 'Ligue1', name: 'Ligue 1' },
  { id: '1Bundesliga', name: '1. Bundesliga' },
];
const speedIntervals = {
  '0.5x': 30000,
  '1x': 20000,
  '1.5x': 10000,
};

const MatchSimulation = () => {
  const { league, match_id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [matchInfo, setMatchInfo] = useState(null);
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState('1x');
  const [simMinute, setSimMinute] = useState(0);
  const [simSecond, setSimSecond] = useState(0);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);


  const intervalRef = useRef(null);

  const fetchMatchInfo = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/match_detail/?statsbomb_id=${match_id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMatchInfo(res.data);
    } catch (err) {
      setError('Error al cargar la información del partido');
      console.error(err);
    }
  }, [match_id, accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchMatchInfo();
    }
  }, [accessToken, fetchMatchInfo]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    const simStep = speedIntervals[speed] / 60;
    intervalRef.current = setInterval(() => {
      setSimSecond((prevSec) => {
        if (prevSec >= 59) {
          setSimMinute((prevMin) => (prevMin < 90 ? prevMin + 1 : prevMin));
          return 0;
        }
        return prevSec + 1;
      });
    }, simStep);

    return () => clearInterval(intervalRef.current);
  }, [speed]);

  useEffect(() => {
    // Ejemplo ficticio: goles simulados por minuto
    if (simMinute === 12) setHomeGoals(1);
    if (simMinute === 47) setAwayGoals(1);
  }, [simMinute]);

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const handleGraphsClick = () => {
    const leagueId = LEAGUES.find((l) => l.name === league)?.id || league;
    navigate(`/match_analysis/${leagueId}/${match_id}`);
  };

  const formattedTime = `${String(simMinute).padStart(2, '0')}:${String(simSecond).padStart(2, '0')}`;

  return (
    <div className="match-simulation-container match-simulation-fade-in">
      {matchInfo && (
        <MatchHeader
          matchInfo={matchInfo}
          currentTime={formattedTime}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          homeGoals={homeGoals}
          awayGoals={awayGoals}
        />
      )}

      <MessageBanner message={error} type="error" />

      <CustomButton
        title="Análisis gráfico del partido"
        onPress={handleGraphsClick}
        buttonStyle={{
          width: '300px',
          marginTop: '20px',
          marginBottom: '20px',
          alignSelf: 'center',
        }}
        textStyle={{ fontSize: '17px', fontWeight: '800' }}
      />
    </div>
  );
};


export default MatchSimulation;
