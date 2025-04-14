import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import FootballLogo from '../../components/FootballLogo';
import fieldImage from '../../assets/images/football_pitch_home.png';
import './styles/MatchCarousel.css';


const MatchCarousel = ({ title, matches }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    if (matches.length === 0) return null;

    const match = matches[currentIndex];

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % matches.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length);
    };

    const parsedDate = parseISO(match.date);
    const formattedDate = format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const formattedTime = format(parsedDate, 'HH:mm', { locale: es });

    return (
        <div className="match-carousel">
            <h3 className="carousel-title">{title}</h3>
            <div className="carousel-box">
                <button onClick={prev} className="carousel-arrow">◀</button>
                <div className="match-card" onClick={() => navigate(`/check`)}>
                    <div className="match-layout">
                        <FootballLogo src={match.home_team_crest_url} width="40px" height="40px" />

                        <div className="match-info">
                            <p className="team-name">{match.home_team}</p>
                            <p className="match-score">{match.goals_scored_home_team} - {match.goals_scored_away_team}</p>
                            <p className="team-name">{match.away_team}</p>
                        </div>

                        <FootballLogo src={match.away_team_crest_url} width="40px" height="40px" />
                    </div>
                    <p className="match-date">{formattedDate} – {formattedTime}</p>
                    <img src={fieldImage} alt="Campo de fútbol" className="field-img" />
                </div>
                <button onClick={next} className="carousel-arrow">▶</button>
            </div>
        </div>
    );
};

MatchCarousel.propTypes = {
    title: PropTypes.string.isRequired,
    matches: PropTypes.array.isRequired,
};

export default MatchCarousel;
