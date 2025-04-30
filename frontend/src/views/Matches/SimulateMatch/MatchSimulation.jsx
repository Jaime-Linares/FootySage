import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import CustomButton from '../../../components/CustomButton';
import MessageBanner from '../../../components/MessageBanner';
import MatchHeader from './MatchHeader';
import './styles/MatchSimulation.css';


const LEAGUES = [
  { id: 'LaLiga', name: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 'PremierLeague', name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 'SerieA', name: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: 'Ligue1', name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  { id: '1Bundesliga', name: '1. Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
];

const MatchSimulation = () => {
  const { league, match_id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [matchInfo, setMatchInfo] = useState(null);
  const [error, setError] = useState('');

  const fetchMatchInfo = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/match_detail/?statsbomb_id=${match_id}`,
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

  const handleGraphsClick = (league, matchId) => {
    const leagueId = LEAGUES.find((l) => l.name === league)?.id || league;
    navigate(`/match_analysis/${leagueId}/${matchId}`);
  };

  return (
    <div className="match-simulation-container match-simulation-fade-in">
      {matchInfo && <MatchHeader matchInfo={matchInfo} />}

      <MessageBanner message={error} type="error" />

      <CustomButton
        title="Análisis gráfico del partido"
        onPress={() => handleGraphsClick(league, match_id)}
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
