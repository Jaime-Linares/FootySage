import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FootballLogo from './FootballLogo';


const MatchCard = ({ matchday, date, stadium, homeTeam, crestUrlHomeTeam, awayTeam, crestUrlAwayTeam, status, scoreHome, scoreAway, onPress }) => {
    const [isHovered, setIsHovered] = useState(false);

    const parsedDate = new Date(date.split('/').reverse().join('-'));
    const formattedDate = parsedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
    });
    const formattedTime = parsedDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isFinished = status === 'finished';

    const boxStyle = {
        backgroundColor: 'white',
        padding: '6px 10px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '15px',
        fontFamily: 'var(--font-family-base)',
        fontWeight: 500,
    };

    const cardStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '10px 20px',
        backgroundColor: 'var(--color-green)',
        borderRadius: '12px',
        width: 'fit-content',
        cursor: onPress ? 'pointer' : 'default',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease-in-out',
    };

    return (
        <div
            style={cardStyle}
            onClick={onPress}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ ...boxStyle, minWidth: '45px', justifyContent: 'center' }}>
                J {matchday}
            </div>

            <div style={{ ...boxStyle, flexDirection: 'column', textAlign: 'center' }}>
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
            </div>

            <br />

            <div style={{ ...boxStyle }}>
                🏟️ {stadium}
            </div>

            <br />

            <div style={{ ...boxStyle, fontSize: '16px' }}>
                <FootballLogo src={crestUrlHomeTeam} width="24px" height="24px" />
                {homeTeam}
            </div>

            {isFinished ? (
                <>
                    <div style={{ ...boxStyle, fontSize: '16px', fontWeight: 'bold' }}>{scoreHome}</div>
                    <div style={{ ...boxStyle, fontSize: '16px', fontWeight: 'bold' }}>{scoreAway}</div>
                </>
            ) : (
                <div style={{ ...boxStyle, fontSize: '16px', fontWeight: 'bold' }}>vs.</div>
            )}

            <div style={{ ...boxStyle, fontSize: '16px' }}>
                <FootballLogo src={crestUrlAwayTeam} width="24px" height="24px" />
                {awayTeam}
            </div>
        </div>
    );
};

MatchCard.propTypes = {
    matchday: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    stadium: PropTypes.string.isRequired,
    homeTeam: PropTypes.string.isRequired,
    crestUrlHomeTeam: PropTypes.string.isRequired,
    awayTeam: PropTypes.string.isRequired,
    crestUrlAwayTeam: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['finished', 'scheduled', 'in_progress']).isRequired,
    scoreHome: PropTypes.number,
    scoreAway: PropTypes.number,
    onPress: PropTypes.func,
};


export default MatchCard;
