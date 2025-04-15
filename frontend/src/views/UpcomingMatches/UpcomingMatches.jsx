import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchCard from '../../components/MatchCard';
import MessageBanner from '../../components/MessageBanner';
import './styles/UpcomingMatches.css';


const UpcomingMatches = () => {
  const [groupedMatches, setGroupedMatches] = useState([]);
  const [expandedCompetitions, setExpandedCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ message: '', type: '' });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/upcoming_matches/`)
      .then((res) => {
        const preferredOrder = ['La Liga', 'Premier League', 'Serie A', 'Ligue 1', 'Bundesliga', 'UEFA Champions League', 'UEFA Europa League', 'UEFA Europa Conference League',];

        const sorted = res.data.sort((a, b) => {
          const iA = preferredOrder.indexOf(a.competition.name);
          const iB = preferredOrder.indexOf(b.competition.name);
          return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB);
        });

        setGroupedMatches(sorted);
        if (sorted.length === 0) {
          setMessage({ message: 'No hay partidos disponibles por el momento.', type: 'info' });
        }
      })
      .catch((err) => {
        console.error('Error al cargar los partidos:', err);
        setMessage({ message: 'Error al cargar los partidos. Intenta más tarde.', type: 'error' });
      })
      .finally(() => setLoading(false));
  }, []);

  const breakAfter = 'Bundesliga';
  let hasShownOtherLabel = false;

  const toggleCompetition = (name) => {
    setExpandedCompetitions(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="upcoming-matches-container">
      <h1 className="upcoming-matches-title">Próximos partidos</h1>
      <MessageBanner message={message.message} type={message.type} />

      {loading && <p className="loading-text">Cargando partidos...</p>}

      {!loading && groupedMatches.map((group, index) => {
        const compName = group.competition.name;

        const isAfterBreak = compName !== breakAfter && hasShownOtherLabel === false &&
          groupedMatches.some(g => g.competition.name === breakAfter && groupedMatches.indexOf(g) < index);

        if (isAfterBreak) hasShownOtherLabel = true;

        const isExpanded = expandedCompetitions.includes(compName);

        return (
          <div key={index} className="competition-block">
            {isAfterBreak && (
              <div className="other-competitions-label">
                <h3>Otras competiciones destacadas</h3>
              </div>
            )}

            <div className="competition-header" onClick={() => toggleCompetition(compName)} style={{ cursor: 'pointer' }}>
              <img
                src={group.competition.competition_logo_url}
                alt={`Logo de ${compName}`}
                className="competition-logo"
              />
              <h2 className="competition-name">{compName}</h2>
            </div>

            {isExpanded && (
              <div className="match-cards-container">
                {group.matches.map((match) => {
                  const parsedDate = new Date(match.date);
                  const formattedDate = parsedDate.toLocaleDateString('es-ES') + ' ' + parsedDate.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <MatchCard
                      key={match.id}
                      matchday={match.match_week || match.match_round || '-'}
                      date={formattedDate}
                      stadium={match.stadium}
                      homeTeam={match.home_team}
                      crestUrlHomeTeam={match.home_team_crest_url}
                      awayTeam={match.away_team}
                      crestUrlAwayTeam={match.away_team_crest_url}
                      status={
                        match.status === 'Finished' ? 'finished' :
                          match.status === 'In progress' ? 'in_progress' :
                            'scheduled'
                      }
                      scoreHome={match.goals_scored_home_team}
                      scoreAway={match.goals_scored_away_team}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};


export default UpcomingMatches;
