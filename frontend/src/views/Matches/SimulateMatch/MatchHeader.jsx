import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import CustomButton from '../../../components/CustomButton';
import FootballLogo from '../../../components/FootballLogo';
import './styles/MatchHeader.css';


const MatchHeader = ({ matchInfo, currentTime, speed, onSpeedChange, homeGoals, awayGoals, isFavorite, onToggleFavorite, isSecondHalf }) => {
    return (
        <div className="match-header">
            <div className="match-header-left">
                <FootballLogo
                    src={matchInfo.competition_logo_url}
                    alt="liga"
                    width="60px"
                    height="60px"
                />
                <span className="matchday-box">J {matchInfo.match_week}</span>
                <div className="match-time-wrapper">
                    <span className="match-time">{currentTime}</span>
                    <span className="match-period">{isSecondHalf ? 'T2' : 'T1'}</span>
                </div>
            </div>
            <div className="match-header-center">
                <FootballLogo src={matchInfo.home_team_crest_url} alt={matchInfo.home_team} width="60px" height="60px" />
                <span className="match-team-name">{matchInfo.home_team}</span>
                <span className="score-box">{homeGoals}</span>
                <span className="score-box">{awayGoals}</span>
                <span className="match-team-name">{matchInfo.away_team}</span>
                <FootballLogo src={matchInfo.away_team_crest_url} alt={matchInfo.away_team} width="60px" height="60px" />
            </div>
            <div className="match-header-right">
                {['0.5x', '1x', '2x'].map((s) => (
                    <CustomButton
                        key={s}
                        title={s}
                        onPress={() => onSpeedChange(s)}
                        buttonStyle={{
                            backgroundColor: speed === s ? 'var(--color-green)' : '#555',
                            alignSelf: 'center',
                            padding: '4px 10px',
                            fontSize: '17px',
                            fontWeight: '800',
                            cursor: 'pointer',
                        }}
                        textStyle={{ fontSize: '16px', color: 'white' }}
                    />
                ))}
                <FontAwesomeIcon
                    icon={isFavorite ? solidHeart : regularHeart}
                    size="2x"
                    style={{ color: isFavorite ? 'red' : 'gray', cursor: 'pointer', marginLeft: '30px' }}
                    title={isFavorite ? 'Eliminar de favoritos' : 'Marcar como favorito'}
                    onClick={onToggleFavorite}
                />
            </div>
        </div>
    );
};


export default MatchHeader;

