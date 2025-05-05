import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './styles/MinuteEventsPitch.css';
import pitchImage from '../../../assets/images/statsbomb_football_pitch.png';


const MinuteEventsPitch = ({ events, homeTeam, awayTeam }) => {
    if (!events || events.length === 0) return null;

    const getTooltipContent = (params) => {
        if (!params || !params.value || !Array.isArray(params.value)) return '';
        const [x, y] = params.value;
        const event = events.find(
            e =>
                Math.abs(e.details?.location_x - x) < 0.01 &&
                Math.abs(e.details?.location_y - y) < 0.01
        );
        if (!event) return '';
        const base = [
            `Tipo: <strong>${event.type}</strong>`,
            `Momento: ${event.minute}:${String(event.second).padStart(2, '0')}`,
            `Equipo: ${event.team}`,
        ];
        const details = Object.entries(event.details || {})
            .filter(([_, val]) => val !== null)
            .map(([k, v]) => `${k}: ${v}`);
        return [...base, ...details].join('<br/>');
    };

    const getSeriesData = (teamName, color) =>
        events
            .filter(e => e.team === teamName && e.details.location_x && e.details.location_y)
            .map(e => ({
                value: [e.details.location_x, e.details.location_y],
                symbolSize: 18,
                itemStyle: { color, opacity: 0.8 },
            }));

    const option = {
        xAxis: { show: false, min: -3.5, max: 123.4 },
        yAxis: { show: false, min: -3.5, max: 83.4, inverse: true },
        grid: { top: 0, bottom: 0, left: 0, right: 0 },
        tooltip: {
            trigger: 'item',
            formatter: getTooltipContent,
            backgroundColor: '#f0f0f0',
            borderColor: '#ccc',
            borderWidth: 1,
            textStyle: { color: '#000', fontSize: 13 },
        },
        series: [
            {
                name: 'Eventos Local',
                type: 'scatter',
                data: getSeriesData(homeTeam, '#ff4d4f'),
                z: 10,
            },
            {
                name: 'Eventos Visitante',
                type: 'scatter',
                data: getSeriesData(awayTeam, '#007bff'),
                z: 10,
            }
        ]
    };

    return (
        <div
            className="minute-events-pitch"
            style={{
                backgroundImage: `url(${pitchImage})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <ReactEcharts
                option={option}
                style={{ width: '100%', height: '100%' }}
                opts={{ renderer: 'canvas' }}
            />
        </div>
    );
};


export default MinuteEventsPitch;
