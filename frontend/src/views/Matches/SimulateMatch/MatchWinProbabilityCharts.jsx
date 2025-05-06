import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import MessageBanner from '../../../components/MessageBanner';
import './styles/MatchSimulation.css';


const MatchWinProbabilityCharts = () => {
    const { match_id } = useParams();
    const { accessToken } = useAuth();
    const [probData, setProbData] = useState({ first_half: [], second_half: [] });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/match/win_probabilities/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { statsbomb_id: match_id },
                });
                setProbData(res.data);
            } catch (err) {
                setError('Error cargando probabilidades');
                console.error(err);
            }
        };
        if (accessToken) fetchData();
    }, [accessToken, match_id]);

    const buildOption = (title, data) => ({
        title: {
            text: title,
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
            },
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const minuto = params[0]?.axisValue;
                return `Minuto: ${minuto}<br/>` + params
                    .map(
                        (p) => `${p.marker} ${p.seriesName}: ${(p.value).toFixed(2)}%`
                    )
                    .join('<br/>');
            },
        },
        legend: {
            top: 40,
            data: ['Local', 'Empate', 'Visitante'],
        },
        grid: { left: 60, right: 60, bottom: 60, top: 70 },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none',
                    title: {
                        zoom: 'Zoom',
                        back: 'Restaurar',
                    },
                },
                restore: { title: 'Restaurar' },
                saveAsImage: { title: 'Guardar como imagen' },
            },
            right: 20,
        },
        xAxis: {
            type: 'category',
            name: 'Minuto',
            data: data.map((d) => d.minute),
        },
        yAxis: {
            marginLeft: 50,
            type: 'value',
            name: 'Probabilidad (%)',
            min: 0,
            max: 100,
        },
        series: [
            {
                name: 'Local',
                type: 'line',
                data: data.map((d) => d.home_team * 100),
                lineStyle: { width: 3 },
                itemStyle: { color: '#ff4d4f' },
                symbolSize: 8,
            },
            {
                name: 'Empate',
                type: 'line',
                data: data.map((d) => d.draw * 100),
                lineStyle: { width: 3 },
                itemStyle: { color: '#faad14' },
                symbolSize: 8,
            },
            {
                name: 'Visitante',
                type: 'line',
                data: data.map((d) => d.away_team * 100),
                lineStyle: { width: 3 },
                itemStyle: { color: '#007bff' },
                symbolSize: 8,
            },
        ],
    });

    return (
        <>
            <MessageBanner message={error} type="error" />
            <div className="win-probabilities-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <ReactECharts
                    style={{ width: '49%', height: '500px' }}
                    option={buildOption('Evolución 1ª parte', probData.first_half)}
                />
                <ReactECharts
                    style={{ width: '49%', height: '500px' }}
                    option={buildOption('Evolución 2ª parte', probData.second_half)}
                />
            </div>
        </>
    );
};


export default MatchWinProbabilityCharts;
