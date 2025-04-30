import React from 'react';
import CustomButton from '../../../components/CustomButton';
import FootballLogo from '../../../components/FootballLogo';
import './styles/MatchHeader.css';


const MatchHeader = ({ matchInfo, currentTime, speed, onSpeedChange }) => {
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
                <span className="match-time">{currentTime}</span>
            </div>
            <div className="match-header-center">
                <FootballLogo src={matchInfo.home_team_crest_url} alt={matchInfo.home_team} width="60px" height="60px" />
                <span className="team-name">{matchInfo.home_team}</span>
                <span className="score-box">{matchInfo.goals_scored_home_team}</span>
                <span className="score-box">{matchInfo.goals_scored_away_team}</span>
                <span className="team-name">{matchInfo.away_team}</span>
                <FootballLogo src={matchInfo.away_team_crest_url} alt={matchInfo.away_team} width="60px" height="60px" />
            </div>
            <div className="match-header-right">
                {['0.5x', '1x', '1.5x'].map((s) => (
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
            </div>
        </div>
    );
};


export default MatchHeader;

