import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/CustomButton';
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

  const handleGraphsClick = (league, matchId) => {
    const leagueId = LEAGUES.find((l) => l.name === league)?.id || league;
    navigate(`/match_analysis/${leagueId}/${matchId}`);
  };

  return (
    <div className="match-simulation-container match-simulation-fade-in">
      <CustomButton
        title="Análisis gráfico del partido"
        onPress={() => handleGraphsClick(league, match_id)}
        buttonStyle={{ width: '275px', marginTop: '20px', marginBottom: '20px', alignSelf: 'center' }}
        textStyle={{ fontSize: '17px' }}
      />
    </div>
  );
};


export default MatchSimulation;
