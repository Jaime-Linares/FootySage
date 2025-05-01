import React, { useState } from 'react';
import { FaBackward, FaForward, FaPause, FaPlay } from 'react-icons/fa';
import CustomButton from '../../../components/CustomButton';
import './styles/MatchTimeControls.css';


const MatchTimeControls = ({ isSecondHalf, isPlaying, onTogglePlay, currentMinute, maxMinute, onSeekMinute, onSelectHalf }) => {
    const minMinute = isSecondHalf ? 45 : 0;
    const [hoverMinute, setHoverMinute] = useState(currentMinute);
    const [showTooltip, setShowTooltip] = useState(false);
    const getTooltipPosition = () => {
        const ratio = (hoverMinute - minMinute) / (maxMinute - minMinute);
        return `${ratio * 100}%`;
    };

    return (
        <div className="match-controls">
            <div className="half-indicators">
                <CustomButton
                    title="1ª parte"
                    onPress={() => {
                        onSelectHalf(1);
                        onSeekMinute(0);
                    }}
                    buttonStyle={{
                        backgroundColor: !isSecondHalf ? 'var(--color-green)' : '#ccc',
                        padding: '6px 12px',
                        borderRadius: '999px',
                    }}
                    textStyle={{ fontSize: '14px' }}
                />
                <CustomButton
                    title="2ª parte"
                    onPress={() => {
                        onSelectHalf(2);
                        onSeekMinute(45);
                    }}
                    buttonStyle={{
                        backgroundColor: isSecondHalf ? 'var(--color-green)' : '#ccc',
                        padding: '6px 12px',
                        borderRadius: '999px',
                    }}
                    textStyle={{ fontSize: '14px' }}
                />
            </div>

            <div className="progress-bar-section">
                <div className="progress-bar-wrapper">
                    {showTooltip && (
                        <div className="progress-tooltip" style={{ left: getTooltipPosition() }}>
                            {hoverMinute}'
                        </div>
                    )}
                    <input
                        type="range"
                        min={minMinute}
                        max={maxMinute}
                        value={currentMinute}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            onSeekMinute(val);
                            setHoverMinute(val);
                        }}
                        onMouseDown={() => setShowTooltip(true)}
                        onMouseUp={() => setShowTooltip(false)}
                        onTouchStart={() => setShowTooltip(true)}
                        onTouchEnd={() => setShowTooltip(false)}
                        onMouseMove={(e) => {
                            const val = parseInt(e.target.value);
                            setHoverMinute(val);
                        }}
                        className="progress-bar"
                    />
                </div>
                <div className="control-buttons">
                    <FaBackward className="clickable" onClick={() => onSeekMinute(minMinute)} />
                    {isPlaying ? (
                        <FaPause onClick={onTogglePlay} className="clickable" />
                    ) : (
                        <FaPlay onClick={onTogglePlay} className="clickable" />
                    )}
                    <FaForward className="clickable" onClick={() => onSeekMinute(maxMinute)} />
                </div>
            </div>
        </div>
    );
};


export default MatchTimeControls;
