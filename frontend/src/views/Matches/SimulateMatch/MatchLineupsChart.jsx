import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import fieldImage from '../../../assets/images/alineaciones.png';
import './styles/MatchSimulation.css';


const POSITION_MAP = {
    'Goalkeeper': [60, 10],
    'Right Back': [95, 25],
    'Left Back': [25, 25],
    'Right Center Back': [80, 25],
    'Left Center Back': [40, 25],
    'Right Wing Back': [105, 30],
    'Left Wing Back': [15, 30],
    'Right Defensive Midfield': [85, 40],
    'Left Defensive Midfield': [35, 40],
    'Center Defensive Midfield': [60, 40],
    'Right Midfield': [95, 50],
    'Left Midfield': [25, 50],
    'Right Center Midfield': [80, 50],
    'Left Center Midfield': [40, 50],
    'Center Midfield': [60, 50],
    'Right Attacking Midfield': [85, 60],
    'Left Attacking Midfield': [35, 60],
    'Center Attacking Midfield': [60, 60],
    'Right Wing': [100, 60],
    'Left Wing': [20, 60],
    'Right Center Forward': [80, 70],
    'Left Center Forward': [40, 70],
    'Center Forward': [60, 70],
    'Secondary Striker': [60, 65],
};

const buildOption = (team, color) => {
    const data = team.players.map((p) => {
        const pos = POSITION_MAP[p.position] || [0, 0];
        return {
            value: pos,
            name: p.name,
            jersey: p.jersey_number,
            position: p.position
        };
    });

    return {
        tooltip: {
            trigger: 'item',
            formatter: (params) =>
                `Nombre: <strong>${params.data.name}</strong><br/>
                Posición: <strong>${params.data.position}</strong>`
        },
        graphic: [{
            type: 'image',
            left: 0,
            top: 0,
            z: -10,
            style: {
                image: fieldImage,
                width: 730,
                height: 600,
                opacity: 1,
            }
        }],
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: { min: 0, max: 120, show: false },
        yAxis: { min: 0, max: 80, show: false },
        series: [{
            type: 'scatter',
            coordinateSystem: 'cartesian2d',
            data,
            symbolSize: 38,
            label: {
                show: true,
                formatter: (params) => params.data.jersey,
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 13,
            },
            itemStyle: {
                color,
                borderColor: '#fff',
                borderWidth: 2,
            }
        }],
    };
};

const MatchLineupsChart = ({ matchInfo }) => {
    const { match_id } = useParams();
    const { accessToken } = useAuth();
    const [lineups, setLineups] = useState({ home_team: null, away_team: null });

    useEffect(() => {
        const fetchLineups = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/match/starting_lineups/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { statsbomb_id: match_id },
                });
                setLineups(res.data);
            } catch (err) {
                console.error('Error fetching lineups', err);
            }
        };
        if (accessToken) fetchLineups();
    }, [accessToken, match_id]);

    return (
        <div className="lineups-container">
            {lineups.home_team && (
                <div className="lineup-chart">
                    <h3 className="lineup-title">Alineación {matchInfo.home_team}</h3>
                    <ReactECharts option={buildOption(lineups.home_team, '#ff4d4f')} style={{ height: '600px', width: '100%' }} />
                </div>
            )}
            {lineups.away_team && (
                <div className="lineup-chart">
                    <h3 className="lineup-title">Alineación {matchInfo.away_team}</h3>
                    <ReactECharts option={buildOption(lineups.away_team, '#007bff')} style={{ height: '600px', width: '100%' }} />
                </div>
            )}
        </div>
    );
};


export default MatchLineupsChart;
