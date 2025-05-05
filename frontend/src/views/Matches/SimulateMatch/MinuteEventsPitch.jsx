import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './styles/MinuteEventsPitch.css';
import pitchImage from '../../../assets/images/alineaciones.png'; // Ajusta la ruta si es necesario

const MinuteEventsPitch = ({ events, homeTeam, awayTeam }) => {
    if (!events || events.length === 0) return null;

    const getTooltipContent = (params) => {
        const [x, y] = params.value;
        const event = events.find(
            e =>
                Math.abs(e.details.location_x - x) < 0.01 &&
                Math.abs(e.details.location_y - y) < 0.01
        );
        if (!event) return '';
        const base = [
            `Tipo: <strong>${event.type}</strong>`,
            `Momento: ${event.minute}:${event.second}`,
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
                symbolSize: 14,
                itemStyle: { color },
            }));

    const option = {
        xAxis: { show: false, min: -10, max: 130 },
        yAxis: { show: false, min: -10, max: 90 },
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
            },
            {
                name: 'Eventos Visitante',
                type: 'scatter',
                data: getSeriesData(awayTeam, '#007bff'),
            }
        ]
    };

    return (
        <div
            className="minute-events-pitch"
            style={{
                backgroundImage: `url(${pitchImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <ReactEcharts
                option={option}
                style={{ height: '700px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
            />
        </div>
    );
};

export default MinuteEventsPitch;
