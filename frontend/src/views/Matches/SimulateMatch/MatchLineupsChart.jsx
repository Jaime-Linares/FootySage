import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import FootballLogo from '../../../components/FootballLogo';
import fieldImage from '../../../assets/images/alineaciones.png';
import './styles/MatchSimulation.css';


const POSITION_MAP = {
    'Goalkeeper': [60, 10],
    'Right Back': [100, 20],
    'Left Back': [20, 20],
    'Right Center Back': [80, 20],
    'Center Back': [60, 20],
    'Left Center Back': [40, 20],
    'Right Wing Back': [100, 35],
    'Left Wing Back': [20, 35],
    'Right Defensive Midfield': [80, 35],
    'Left Defensive Midfield': [40, 35],
    'Center Defensive Midfield': [60, 35],
    'Right Midfield': [100, 45],
    'Left Midfield': [20, 45],
    'Right Center Midfield': [80, 45],
    'Left Center Midfield': [40, 45],
    'Center Midfield': [60, 45],
    'Right Attacking Midfield': [80, 55],
    'Left Attacking Midfield': [40, 55],
    'Center Attacking Midfield': [60, 55],
    'Right Wing': [100, 55],
    'Left Wing': [20, 55],
    'Right Center Forward': [80, 70],
    'Left Center Forward': [40, 70],
    'Center Forward': [60, 70],
    'Secondary Striker': [60, 60],
    'Striker': [60, 70],
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

    const formatFormation = (formation) => {
        return formation.toString().split('').join('-');
    };

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
                    <div className="lineup-header">
                        <FootballLogo src={matchInfo.home_team_crest_url} alt={matchInfo.home_team} width="50px" height="50px" />
                        <h3 className="lineup-title">Alineación <span style={{ fontWeight: 800 }}>{matchInfo.home_team}</span>: {formatFormation(lineups.home_team.formation)}</h3>
                    </div>
                    <div className="coach-name">
                        <span>Entrenador: <strong>{matchInfo.home_team_coach_name}</strong></span>
                    </div>
                    <ReactECharts option={buildOption(lineups.home_team, '#ff4d4f')} style={{ height: '600px', width: '100%' }} />
                </div>
            )}
            {lineups.away_team && (
                <div className="lineup-chart">
                    <div className="lineup-header">
                        <FootballLogo src={matchInfo.away_team_crest_url} alt={matchInfo.away_team} width='50px' height='50px' />
                        <h3 className="lineup-title">Alineación <span style={{ fontWeight: 800 }}>{matchInfo.away_team}</span>: {formatFormation(lineups.away_team.formation)}</h3>
                    </div>
                    <div className="coach-name">
                        <span>Entrenador: <strong>{matchInfo.away_team_coach_name}</strong></span>
                    </div>
                    <ReactECharts option={buildOption(lineups.away_team, '#007bff')} style={{ height: '600px', width: '100%' }} />
                </div>
            )}
        </div>
    );
};


export default MatchLineupsChart;
