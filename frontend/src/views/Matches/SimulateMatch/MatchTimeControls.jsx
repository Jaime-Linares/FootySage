import React, { useState } from 'react';
import { FaBackward, FaForward, FaPause, FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
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

    const seekOneMinute = (direction) => {
        const newMinute = direction === 'back'
            ? Math.max(currentMinute - 1, minMinute)
            : Math.min(currentMinute + 1, maxMinute);
        onSeekMinute(newMinute);
        setHoverMinute(newMinute);
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
                    <FaBackward className="clickable" title="Ir al inicio" onClick={() => onSeekMinute(minMinute)} />
                    <FaStepBackward className="clickable" title="Retroceder 1 minuto" onClick={() => seekOneMinute('back')} />
                    {isPlaying ? (
                        <FaPause onClick={onTogglePlay} className="clickable" title="Pausa" />
                    ) : (
                        <FaPlay onClick={onTogglePlay} className="clickable" title="Reproducir" />
                    )}
                    <FaStepForward className="clickable" title="Avanzar 1 minuto" onClick={() => seekOneMinute('forward')} />
                    <FaForward className="clickable" title="Ir al final" onClick={() => onSeekMinute(maxMinute)} />
                </div>
            </div>
        </div>
    );
};


export default MatchTimeControls;
