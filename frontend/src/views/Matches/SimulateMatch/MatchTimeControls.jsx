import React from 'react';
import { FaBackward, FaForward, FaPause, FaPlay } from 'react-icons/fa';
import CustomButton from '../../../components/CustomButton';
import './styles/MatchTimeControls.css';


const MatchTimeControls = ({ isSecondHalf, onTogglePlay, isPlaying, currentMinute, maxMinute, onSeekMinute }) => {
    return (
        <div className="match-controls">
            <div className="half-indicators">
                <CustomButton
                    title="1ª parte"
                    onPress={() => onSeekMinute(0)}
                    buttonStyle={{
                        backgroundColor: !isSecondHalf ? 'var(--color-green)' : '#ccc',
                        padding: '6px 12px',
                        borderRadius: '999px',
                    }}
                    textStyle={{ fontSize: '14px' }}
                />
                <CustomButton
                    title="2ª parte"
                    onPress={() => onSeekMinute(45)}
                    buttonStyle={{
                        backgroundColor: isSecondHalf ? 'var(--color-green)' : '#ccc',
                        padding: '6px 12px',
                        borderRadius: '999px',
                    }}
                    textStyle={{ fontSize: '14px' }}
                />
            </div>
            <div className="progress-bar-section">
                <input
                    type="range"
                    min="0"
                    max={maxMinute}
                    value={currentMinute}
                    onChange={(e) => onSeekMinute(parseInt(e.target.value))}
                    className="progress-bar"
                />
                <div className="control-buttons">
                    <FaBackward className="clickable" />
                    {isPlaying ? (
                        <FaPause onClick={onTogglePlay} className="clickable" />
                    ) : (
                        <FaPlay onClick={onTogglePlay} className="clickable" />
                    )}
                    <FaForward className="clickable" />
                </div>
            </div>
        </div>
    );
};


export default MatchTimeControls;
