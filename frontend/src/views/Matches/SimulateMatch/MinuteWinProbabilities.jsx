import React from 'react';
import './styles/MinuteWinProbabilities.css';


const MinuteWinProbabilities = ({ probabilities, homeTeamName, awayTeamName }) => {
    if (!probabilities) return null;
    const home = probabilities.home_team * 100;
    const draw = probabilities.draw * 100;
    const away = probabilities.away_team * 100;

    return (
        <div className="minute-probabilities-container">
            <div className="probabilities-legend">
                <div className="legend-item">
                    <span className="color-box red" />
                    Victoria {homeTeamName}
                </div>
                <div className="legend-item">
                    <span className="color-box yellow" />
                    Empate
                </div>
                <div className="legend-item">
                    <span className="color-box blue" />
                    Victoria {awayTeamName}
                </div>
            </div>

            <div className="probabilities-bar">
                <div className="bar-segment red" style={{ width: `${home}%` }}>
                    {home > 5 && <span>{home.toFixed(2)}%</span>}
                </div>
                <div className="bar-segment yellow" style={{ width: `${draw}%` }}>
                    {draw > 5 && <span>{draw.toFixed(2)}%</span>}
                </div>
                <div className="bar-segment blue" style={{ width: `${away}%` }}>
                    {away > 5 && <span>{away.toFixed(2)}%</span>}
                </div>
            </div>
        </div>
    );
};


export default MinuteWinProbabilities;
