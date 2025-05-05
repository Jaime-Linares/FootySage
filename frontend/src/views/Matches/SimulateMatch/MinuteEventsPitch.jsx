import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './styles/MinuteEventsPitch.css';
import pitchImage from '../../../assets/images/statsbomb_football_pitch.png';


const MinuteEventsPitch = ({ events, homeTeam, awayTeam }) => {
    if (!events) return null;

    const getTooltipContent = (params) => {
        const event = params?.data?.eventData;
        if (!event) return '';
        const base = [
            `<strong style="margin: 0; padding: 0; font-weight: bold; line-height: 0;">${event.type}</strong>`,
            `<strong style="margin: 0; padding: 0; font-weight: bold; line-height: 0;">${event.team}, ${event.minute}:${String(event.second).padStart(2, '0')}</strong>`,
        ];
        const details = Object.entries(event.details || {})
            .filter(([k, val]) => val !== null && k !== 'location_x' && k !== 'location_y')
            .map(([k, v]) => `${k}: ${v}`);
        const content = [...base, ...details].join('<br/>');
        return `
            <div style="
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                line-height: 1.2;
                margin: 0;
                padding: 0;
            ">
                ${content}
            </div>
        `;
    };

    const getSeriesData = (teamName, color) => {
        const coordsMap = new Map();
        return events
            .filter(e => e.team === teamName && e.details.location_x && e.details.location_y)
            .map(e => {
                let x = e.details.location_x;
                let y = e.details.location_y;
                if (teamName === awayTeam) {
                    x = 120 - x;
                    y = 80 - y;
                }

                const key = `${Math.round(x * 10)},${Math.round(y * 10)}`;
                const count = coordsMap.get(key) || 0;
                coordsMap.set(key, count + 1);
                const offset = count * 1.5;
                const angle = (count * 45 * Math.PI) / 180;

                return {
                    value: [
                        x + Math.cos(angle) * offset,
                        y + Math.sin(angle) * offset
                    ],
                    symbolSize: 18,
                    itemStyle: { color, opacity: 0.8 },
                    eventData: e
                };
            });
    };

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
