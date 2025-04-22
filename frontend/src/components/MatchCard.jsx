import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FootballLogo from './FootballLogo';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';


const MatchCard = ({ matchday, date, stadium, homeTeam, crestUrlHomeTeam, awayTeam, crestUrlAwayTeam, status, scoreHome, scoreAway, onPress }) => {
    const [isHovered, setIsHovered] = useState(false);

    const parsedDate = parse(date, 'dd/MM/yyyy HH:mm', new Date());
    const formattedDate = format(parsedDate, "dd 'de' MMMM", { locale: es });
    const formattedTime = format(parsedDate, 'HH:mm', { locale: es });

    const isFinished = status === 'finished';

    const baseBoxStyle = {
        backgroundColor: 'white',
        padding: '6px 10px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontSize: '15px',
        fontFamily: 'var(--font-family-base)',
        fontWeight: 500,
        textAlign: 'center'
    };

    const matchWeekStyle = {
        ...baseBoxStyle,
        minWidth: '70px',
        maxWidth: '70px'
    };

    const dateStyle = {
        ...baseBoxStyle,
        minWidth: '110px',
        maxWidth: '110px',
        flexDirection: 'column'
    };

    const stadiumStyle = {
        ...baseBoxStyle,
        minWidth: '210px',
        maxWidth: '210px'
    };

    const homeTeamStyle = {
        ...baseBoxStyle,
        minWidth: '200px',
        maxWidth: '200px',
        fontWeight: 'bold'
    };

    const resultStyle = {
        ...baseBoxStyle,
        minWidth: '6px',
        maxWidth: '6px',
        fontSize: '16px',
        fontWeight: 'bold'
    };

    const vsStyle = {
        ...baseBoxStyle,
        minWidth: '40px',
        maxWidth: '40px',
        fontSize: '16px',
        fontWeight: 'bold'
    };

    const awayTeamStyle = {
        ...baseBoxStyle,
        minWidth: '200px',
        maxWidth: '200px',
        fontWeight: 'bold'
    };

    const cardStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '10px 20px',
        backgroundColor: 'var(--color-green)',
        borderRadius: '12px',
        height: 'fit-content',
        width: '1100px',
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
            <div style={matchWeekStyle}>
                {typeof matchday === 'number' ? `Jornada ${matchday}` : matchday}
            </div>

            <div style={dateStyle}>
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
            </div>

            <div style={stadiumStyle}>🏟️ {stadium}</div>

            <br />
            <div style={homeTeamStyle}>
                <FootballLogo src={crestUrlHomeTeam} width="24px" height="24px" />
                {homeTeam}
            </div>

            {isFinished ? (
                <>
                    <div style={resultStyle}>{scoreHome}</div>
                    <div style={resultStyle}>{scoreAway}</div>
                </>
            ) : (
                <div style={vsStyle}>vs.</div>
            )}

            <div style={awayTeamStyle}>
                <FootballLogo src={crestUrlAwayTeam} width="24px" height="24px" />
                {awayTeam}
            </div>
        </div>
    );
};

MatchCard.propTypes = {
    matchday: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
