import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import CustomSelectDropdown from '../../../components/CustomSelectDropdown';
import CustomButton from '../../../components/CustomButton';
import MatchCard from '../../../components/MatchCard';
import MessageBanner from '../../../components/MessageBanner';
import './styles/MatchSelector.css';


const MatchSelector = () => {
    const { accessToken } = useAuth();
    const [teams, setTeams] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [genres, setGenres] = useState([]);
    const [message, setMessage] = useState({ message: '', type: '' });
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        home_team: null,
        away_team: null,
        competition: null,
        season_name: null,
        genre: null,
    });

    const fetchMatches = async () => {
        setMessage({ message: '', type: '' });
        setLoading(true);
        try {
            const params = {};
            if (filters.home_team) params.home_team = filters.home_team.value;
            if (filters.away_team) params.away_team = filters.away_team.value;
            if (filters.competition) params.competition = filters.competition.value;
            if (filters.season_name) params.season_name = filters.season_name.value;
            if (filters.genre) params.genre = filters.genre.value;

            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/filtered_matches/`, {
                params,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setMatches(res.data);
        } catch (err) {
            console.error('Error al buscar partidos', err);
            setMessage({ message: 'Error al buscar partidos. Inicia sesión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamsRes, compsRes, seasonsRes, genresRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/teams/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/competitions_match/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/seasons_match/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/genres_match/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }),
                ]);

                setTeams(teamsRes.data.map(t => ({
                    label: t.name,
                    value: t.name,
                    image: t.football_crest_url
                })));

                setCompetitions(compsRes.data.map(c => ({
                    label: c.name,
                    value: c.name,
                    image: c.competition_logo_url
                })));

                setSeasons(seasonsRes.data.map(s => ({ label: s, value: s })));
                setGenres(genresRes.data.map(g => ({
                    label: g === 'male' ? 'Masculino' : 'Femenino',
                    value: g
                })));
            } catch (err) {
                console.error('Error cargando filtros', err);
                setMessage({ message: 'Error cargando filtros. Inicia sesión', type: 'error' });
            }
        };

        fetchData();
        fetchMatches();
    }, []);

    return (
        <div className="match-selector-container">
            <h1 className="match-selector-title">Análisis partidos en tiempo real</h1>
            <MessageBanner message={message.message} type={message.type} />

            <div className="match-selector-filters">
                <CustomSelectDropdown
                    options={teams}
                    placeholder="Equipo local"
                    onChange={(value) => setFilters(prev => ({ ...prev, home_team: value }))}
                    value={filters.home_team}
                />
                <CustomSelectDropdown
                    options={teams}
                    placeholder="Equipo visitante"
                    onChange={(value) => setFilters(prev => ({ ...prev, away_team: value }))}
                    value={filters.away_team}
                />
                <CustomSelectDropdown
                    options={competitions}
                    placeholder="Competición"
                    onChange={(value) => setFilters(prev => ({ ...prev, competition: value }))}
                    value={filters.competition}
                />
                <CustomSelectDropdown
                    options={seasons}
                    placeholder="Temporada"
                    onChange={(value) => setFilters(prev => ({ ...prev, season_name: value }))}
                    value={filters.season_name}
                />
                <CustomSelectDropdown
                    options={genres}
                    placeholder="Género"
                    onChange={(value) => setFilters(prev => ({ ...prev, genre: value }))}
                    value={filters.genre}
                />
            </div>

            <div className="match-selector-button">
                <CustomButton 
                    title="Buscar" 
                    onPress={fetchMatches} 
                    textStyle={{ color: 'white', fontWeight: 'bold', fontSize: '17px' }}
                />
            </div>

            <div className="match-selector-results">
                <h2 className="match-selector-results-title">Resultados de la búsqueda</h2>
                {loading ? (
                    <p className="match-selector-loading">Cargando partidos...</p>
                ) : (
                    <div className="match-selector-matches">
                        {matches.length === 0 ? (
                            <p className="match-selector-no-results">No se encontraron partidos con esos filtros.</p>
                        ) : (
                            matches.map(match => {
                                const parsedDate = new Date(match.date);
                                const dateString = parsedDate.toLocaleDateString('es-ES') + ' ' + parsedDate.toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });

                                return (
                                    <MatchCard
                                        key={match.id}
                                        matchday={match.match_week || match.match_round || '-'}
                                        date={dateString}
                                        stadium={match.stadium}
                                        homeTeam={match.home_team}
                                        crestUrlHomeTeam={match.home_team_crest_url}
                                        awayTeam={match.away_team}
                                        crestUrlAwayTeam={match.away_team_crest_url}
                                        status={match.status === 'Finished' ? 'finished' : match.status === 'In progress' ? 'in_progress' : 'scheduled'}
                                        scoreHome={match.goals_scored_home_team ?? 0}
                                        scoreAway={match.goals_scored_away_team ?? 0}
                                    />
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export default MatchSelector;
