import React from 'react';
import { FaBackward, FaForward, FaPause, FaPlay } from 'react-icons/fa';
import './styles/MatchTimeControls.css';


const MatchTimeControls = ({ isSecondHalf, onTogglePlay, isPlaying, currentMinute, maxMinute, onSeekMinute }) => {
    return (
        <div className="match-controls">
            <div className="half-indicators">
                <div className={`half-button ${!isSecondHalf ? 'active' : ''}`}>1ª parte</div>
                <div className={`half-button ${isSecondHalf ? 'active' : ''}`}>2ª parte</div>
            </div>

            <div className="progress-bar-container">
                <input
                    type="range"
                    min="0"
                    max={maxMinute}
                    value={currentMinute}
                    onChange={(e) => onSeekMinute(parseInt(e.target.value))}
                    className="progress-bar"
                />
            </div>

            <div className="control-buttons">
                <FaBackward />
                {isPlaying ? (
                    <FaPause onClick={onTogglePlay} className="clickable" />
                ) : (
                    <FaPlay onClick={onTogglePlay} className="clickable" />
                )}
                <FaForward />
            </div>
        </div>
    );
};


export default MatchTimeControls;
