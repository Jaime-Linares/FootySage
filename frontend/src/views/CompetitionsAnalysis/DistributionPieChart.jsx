import React from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from 'prop-types';


const LEAGUES = [
    { id: 'LaLiga', name: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
    { id: 'PremierLeague', name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    { id: 'SerieA', name: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' },
    { id: 'Ligue1', name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
    { id: '1Bundesliga', name: '1. Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
];

const DistributionPieChart = ({ data, selectedFeatureName }) => {
    if (!data || !Array.isArray(data)) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando distribución...</div>;
    }

    const totalSum = data.reduce((sum, d) => sum + d.average_per_match, 0);
    if (totalSum === 0) {
        return <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold'}}>No hay datos de esta característica como para generar un gráfico</div>;
    }

    const pieData = data.map(d => ({
        name: LEAGUES.find(l => l.id === d.league)?.name || d.league,
        value: d.average_per_match > 0 ? d.average_per_match : 0.0001,
    }));

    return (
        <ReactECharts
            style={{ width: '70%', height: '550px' }}
            option={{
                title: {
                    text: selectedFeatureName,
                    left: 'center',
                    top: 10,
                    textStyle: {
                        fontSize: 20,
                        fontWeight: '800',
                        fontFamily: 'Arial, sans-serif',
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top: 'middle',
                },
                series: [
                    {
                        name: 'Distribución',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '55%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 6,
                            borderColor: '#fff',
                            borderWidth: 3
                        },
                        label: {
                            show: true,
                            formatter: '{b}\n({d}%)',
                            fontSize: 14
                        },
                        labelLine: {
                            show: true
                        },
                        data: pieData,
                    }
                ]
            }}
        />
    );
};

DistributionPieChart.propTypes = {
    data: PropTypes.array.isRequired,
    selectedFeatureName: PropTypes.string.isRequired,
};


export default DistributionPieChart;
