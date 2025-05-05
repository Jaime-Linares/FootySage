import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import CustomButton from '../../../components/CustomButton';
import MessageBanner from '../../../components/MessageBanner';
import MatchHeader from './MatchHeader';
import MatchTimeControls from './MatchTimeControls';
import MatchWinProbabilityCharts from './MatchWinProbabilityCharts';
import MatchLineupsChart from './MatchLineupsChart';
import ImportantMatchEventsTimeline from './ImportantMatchEventsTimeline';
import MinuteWinProbabilities from './MinuteWinProbabilities';
import MinuteEventsPitch from './MinuteEventsPitch';
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
  const [minuteProbabilities, setMinuteProbabilities] = useState(null);
  const [minuteEvents, setMinuteEvents] = useState([]);
  const [isSecondHalf, setIsSecondHalf] = useState(false);
  const [halfEndMinutes, setHalfEndMinutes] = useState({ first_half: 45, second_half: 90 });
  const [isPlaying, setIsPlaying] = useState(true);

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
    }
  }, [match_id, accessToken]);

  const fetchHalfEndMinutes = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/match/half_end_minutes/?statsbomb_id=${match_id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setHalfEndMinutes({
        first_half: res.data.first_half_final_minute ?? 45,
        second_half: res.data.second_half_final_minute ?? 90,
      });
    } catch (err) {
      setError('Error al cargar los minutos de fin de cada parte: ' + err);
    }
  }, [accessToken, match_id]);

  const fetchFavoriteStatus = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user?.user_id}/favorite_matches/`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const isFav = res.data.some(m => m.id === matchInfo?.id);
      setIsFavorite(isFav);
    } catch (err) {
      setError('Error al obtener el estado de favorito: ' + err);
    }
  }, [accessToken, user, matchInfo]);

  useEffect(() => {
    if (accessToken) {
      fetchMatchInfo();
    }
  }, [accessToken, fetchMatchInfo]);

  useEffect(() => {
    if (accessToken && matchInfo?.id) {
      fetchFavoriteStatus();
      fetchHalfEndMinutes();
    }
  }, [accessToken, matchInfo, fetchFavoriteStatus, fetchHalfEndMinutes]);

  const startClock = useCallback(() => {
    clearInterval(intervalRef.current);
    const simStep = speedIntervals[speed] / 60;

    intervalRef.current = setInterval(() => {
      setSimTime(prev => {
        const nextSec = prev.second + 1;
        const shouldIncMin = nextSec >= 60;
        const nextMin = shouldIncMin ? prev.minute + 1 : prev.minute;
        const nextSecFinal = shouldIncMin ? 0 : nextSec;
        if (!isSecondHalf && prev.minute === halfEndMinutes.first_half - 1 && prev.second === 59) {
          setIsSecondHalf(true);
          return { minute: 45, second: 0 };
        }
        if (isSecondHalf && prev.minute === halfEndMinutes.second_half - 1 && prev.second === 59) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prev;
        }
        return {
          minute: nextMin,
          second: nextSecFinal,
        };
      });
    }, simStep);
  }, [speed, isSecondHalf, halfEndMinutes]);

  useEffect(() => {
    if (isPlaying) startClock();
    return () => clearInterval(intervalRef.current);
  }, [speed, isPlaying, isSecondHalf, halfEndMinutes, startClock]);

  useEffect(() => {
    const fetchGoalsProbabilitiesAndEvents = async () => {
      try {
        const [goalsRes, probsRes, eventsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/match/goals_until_minute/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              statsbomb_id: match_id,
              minute: simTime.minute,
              period: isSecondHalf ? 2 : 1,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/match/win_probability_at_minute/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              statsbomb_id: match_id,
              minute: simTime.minute + 1,
              period: isSecondHalf ? 2 : 1,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/match/events_at_minute/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              statsbomb_id: match_id,
              minute: simTime.minute,
              period: isSecondHalf ? 2 : 1,
            },
          }),
        ]);
        setHomeGoals(goalsRes.data.home_team_goals);
        setAwayGoals(goalsRes.data.away_team_goals);
        setMinuteProbabilities(probsRes.data);
        setMinuteEvents(eventsRes.data);
      } catch (err) {
        setError('Error al obtener goles o probabilidades: ' + err);
        setMinuteProbabilities(null);
        setMinuteEvents([]);
      }
    };

    if (simTime.second === 0) {
      fetchGoalsProbabilitiesAndEvents();
    }
  }, [simTime.minute, simTime.second, isSecondHalf, accessToken, match_id]);

  const formattedTime = `${String(simTime.minute).padStart(2, '0')}:${String(simTime.second).padStart(2, '0')}`;

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
      setError('Error al cambiar favorito');
    }
  };

  const handleGraphsClick = () => {
    const leagueId = LEAGUES.find((l) => l.name === league)?.id || league;
    navigate(`/match_analysis/${leagueId}/${match_id}`);
  };

  return (
    <div className="match-simulation-container match-simulation-fade-in">
      {matchInfo && (
        <MatchHeader
          matchInfo={matchInfo}
          currentTime={formattedTime}
          speed={speed}
          onSpeedChange={setSpeed}
          homeGoals={homeGoals}
          awayGoals={awayGoals}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isSecondHalf={isSecondHalf}
        />
      )}

      <MessageBanner message={error} type="error" />

      {matchInfo && (
        <div className="match-controls-row">
          <div className="match-controls-left">
            <MinuteWinProbabilities
              probabilities={minuteProbabilities}
              homeTeamName={matchInfo.home_team}
              awayTeamName={matchInfo.away_team}
            />
          </div>
          <div className="match-controls-right">
            <MatchTimeControls
              isSecondHalf={isSecondHalf}
              isPlaying={isPlaying}
              onTogglePlay={() => {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                  setIsPlaying(false);
                } else {
                  setIsPlaying(true);
                  setSpeed(speed => speed);
                }
              }}
              currentMinute={simTime.minute}
              maxMinute={isSecondHalf ? halfEndMinutes.second_half - 1 : halfEndMinutes.first_half - 1}
              onSeekMinute={(min) => {
                const max = isSecondHalf ? halfEndMinutes.second_half - 1 : halfEndMinutes.first_half - 1;
                setSimTime({ minute: Math.min(min, max), second: 0 });
              }}
              onSelectHalf={(half) => setIsSecondHalf(half === 2)}
            />
          </div>
        </div>
      )}

      <div style={{ height: '850px', marginBottom: '100px', marginTop: '-20px' }}>
        <h2 className="subtitle">Eventos del minuto actual</h2>
        {matchInfo && (
          <MinuteEventsPitch
            events={minuteEvents}
            homeTeam={matchInfo.home_team}
            awayTeam={matchInfo.away_team}
          />
        )}
      </div>

      <div>
        <h2 className="subtitle">Alineaciones iniciales</h2>
        {matchInfo && (
          <MatchLineupsChart matchInfo={matchInfo} />
        )}
      </div>

      <div>
        <h2 className="subtitle">Evolución de las probabilidades de victoria</h2>
        <MatchWinProbabilityCharts />
      </div>

      <CustomButton
        title="Análisis gráfico del partido"
        onPress={handleGraphsClick}
        buttonStyle={{ width: '300px', marginTop: '5px', marginBottom: '25px', alignSelf: 'center' }}
        textStyle={{ fontSize: '17px', fontWeight: '800' }}
      />

      <div style={{ marginTop: '-25px' }}>
        <h2 className="subtitle">Eventos destacados del partido</h2>
        {matchInfo && (
          <ImportantMatchEventsTimeline
            homeTeam={matchInfo.home_team}
            homeLogo={matchInfo.home_team_crest_url}
            awayTeam={matchInfo.away_team}
            awayLogo={matchInfo.away_team_crest_url}
          />
        )}
      </div>
    </div>
  );
};


export default MatchSimulation;
