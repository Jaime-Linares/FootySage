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
  '0.5x': 40000,
  '1x': 20000,
  '2x': 10000,
};

const MatchSimulation = () => {
  const { league, match_id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const [error, setError] = useState('');
  const [matchInfo, setMatchInfo] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [speed, setSpeed] = useState('1x');
  const [simTime, setSimTime] = useState({ minute: 0, second: 0 });
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    clearInterval(intervalRef.current);
    const simStep = speedIntervals[speed] / 60;
    intervalRef.current = setInterval(() => {
      setSimTime((prev) => {
        if (prev.minute === 91 && prev.second === 0) {
          clearInterval(intervalRef.current);
          return prev;
        }
        const nextSec = prev.second + 1;
        const shouldIncMinute = nextSec >= 60;
        const nextMin = shouldIncMinute ? prev.minute + 1 : prev.minute;
        return {
          minute: shouldIncMinute ? nextMin : prev.minute,
          second: shouldIncMinute ? 0 : nextSec,
        };
      });
    }, simStep);
    return () => clearInterval(intervalRef.current);
  }, [speed]);

  useEffect(() => {
    if (simTime.minute === 12) setHomeGoals(1);
    if (simTime.minute === 47) setAwayGoals(1);
  }, [simTime.minute]);

  const handleSpeedChange = (newSpeed) => setSpeed(newSpeed);

  const fetchMatchInfo = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/match_detail/?statsbomb_id=${match_id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMatchInfo(res.data);
    } catch (err) {
      setError('Error al cargar la información del partido');
    }
  }, [match_id, accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchMatchInfo();
    }
  }, [accessToken, fetchMatchInfo]);

  const fetchFavoriteStatus = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user?.user_id}/favorite_matches/`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const isFav = res.data.some(m => m.id === matchInfo?.id);
      setIsFavorite(isFav);
    } catch (err) {
      console.error('Error al obtener favoritos', err);
    }
  }, [accessToken, user, matchInfo]);

  const toggleFavorite = async () => {
    if (!matchInfo?.id) return;
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/v1/users/match/${matchInfo.id}/favorite${isFavorite ? '/remove/' : '/'}`;
    try {
      await axios({
        method: isFavorite ? 'delete' : 'post',
        url,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsFavorite(prev => !prev);
    } catch (err) {
      console.error('Error al cambiar favorito', err);
      setError('Error al cambiar favorito');
    }
  };

  useEffect(() => {
    if (accessToken && matchInfo?.id) {
      fetchFavoriteStatus();
    }
  }, [accessToken, matchInfo, fetchFavoriteStatus]);

  const handleGraphsClick = () => {
    const leagueId = LEAGUES.find((l) => l.name === league)?.id || league;
    navigate(`/match_analysis/${leagueId}/${match_id}`);
  };

  const formattedTime = `${String(simTime.minute).padStart(2, '0')}:${String(simTime.second).padStart(2, '0')}`;

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
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <MessageBanner message={error} type="error" />

      <CustomButton
        title="Análisis gráfico del partido"
        onPress={handleGraphsClick}
        buttonStyle={{ width: '300px', marginTop: '20px', marginBottom: '20px', alignSelf: 'center' }}
        textStyle={{ fontSize: '17px', fontWeight: '800' }}
      />
    </div>
  );
};


export default MatchSimulation;
