import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { FaStar, FaEye } from 'react-icons/fa';
import CustomButton from '../../components/CustomButton';
import FootballLogo from '../../components/FootballLogo';
import fieldImage from '../../assets/images/football_pitch_home.png';
import './styles/MatchCarousel.css';


const MatchCarousel = ({ title, matches }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const match = matches[currentIndex];

    if (!match || !match.date) {
        return (
            <div className="match-carousel">
                <h3 className="carousel-title">{title}</h3>
                <p className="match-empty-message">Aún no tienes partidos disponibles aquí.</p>
            </div>
        );
    }

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
                <CustomButton
                    title={<FaChevronLeft />}
                    onPress={prev}
                    buttonStyle={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        padding: 0,
                        backgroundColor: 'var(--color-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                    }}
                    textStyle={{
                        fontSize: '20px',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    disabled={matches.length <= 1}
                />
                <div className="match-card" onClick={() => navigate(`/match_simulation/${match.id}`)}>
                    <div className="match-layout">
                        <FootballLogo src={match.home_team_crest_url} width="60px" height="60px" />
                        <div className="match-info">
                            <p className="team-name">{match.home_team}</p>
                            <p className="match-score">{match.goals_scored_home_team} - {match.goals_scored_away_team}</p>
                            <p className="team-name">{match.away_team}</p>
                        </div>
                        <FootballLogo src={match.away_team_crest_url} width="60px" height="60px" />
                    </div>
                    <p className="match-date">{formattedDate} – {formattedTime}</p>
                    <div className="match-field-wrapper">
                        <div className="match-icon-overlay">
                            {title.includes('Último') && <MdAccessTime size={30} color="white" title="Nuevo" />}
                            {title.includes('partidos favoritos') && <FaStar size={30} color="white" title="Favorito" />}
                            {title.includes('analizados') && <FaEye size={30} color="white" title="Más analizado" />}
                        </div>
                        <img src={fieldImage} alt="Campo de fútbol" className="field-img" />
                    </div>
                </div>
                <CustomButton
                    title={<FaChevronRight />}
                    onPress={next}
                    buttonStyle={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        padding: 0,
                        backgroundColor: 'var(--color-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '10px',
                    }}
                    textStyle={{
                        fontSize: '20px',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    disabled={matches.length <= 1}
                />
            </div>
        </div>
    );
};

MatchCarousel.propTypes = {
    title: PropTypes.string.isRequired,
    matches: PropTypes.array.isRequired,
};

export default MatchCarousel;
