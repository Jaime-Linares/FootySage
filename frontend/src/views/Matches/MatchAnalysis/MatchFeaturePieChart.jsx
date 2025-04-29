import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { useAuth } from '../../../context/AuthContext';
import CustomSelectDropdown from '../../../components/CustomSelectDropdown';
import MessageBanner from '../../../components/MessageBanner';


const MatchFeaturePieChart = () => {
    const { league, match_id } = useParams();
    const { accessToken } = useAuth();

    const [features, setFeatures] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [message, setMessage] = useState({ message: '', type: '' });

    useEffect(() => {
        const fetchFeatureOptions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/feature_compare_distribution_options/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const options = res.data.map(f => ({ label: f, value: f }));
                setFeatures(options);
            } catch (error) {
                setMessage({ message: `Error cargando características: ${error}`, type: 'error' });
            }
        };
        if (accessToken) fetchFeatureOptions();
    }, [accessToken]);

    useEffect(() => {
        const fetchChartData = async () => {
            if (!selectedFeature) return;
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/match_feature_distribution/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { league, match_id, feature_name: selectedFeature.value },
                });
                setChartData(res.data);
                setMessage({ message: '', type: '' });
            } catch (error) {
                setChartData(null);
                setMessage({ message: 'Error cargando datos del gráfico', type: 'error' });
            }
        };
        if (selectedFeature && accessToken) fetchChartData();
    }, [selectedFeature, league, match_id, accessToken]);

    return (
        <div>
            <MessageBanner message={message.message} type={message.type} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
                <CustomSelectDropdown
                    options={features}
                    onChange={setSelectedFeature}
                    placeholder="Selecciona una característica"
                    style={{ width: '400px', marginBottom: '20px' }}
                />
            </div>

            {chartData && (
                <ReactECharts
                    style={{ width: '70%', height: '500px', margin: '0 auto' }}
                    option={{
                        title: {
                            text: `${chartData.feature_name}`,
                            left: 'center',
                            textStyle: {
                                fontSize: 20,
                                fontWeight: '800',
                                fontFamily: 'Arial, sans-serif',
                            },
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{b}: {c} ({d}%)',
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: [chartData.home_team, chartData.away_team],
                            top: '40%',
                        },
                        series: [
                            {
                                name: 'Distribución',
                                type: 'pie',
                                radius: ['40%', '70%'],
                                center: ['50%', '50%'],
                                itemStyle: {
                                    borderRadius: 6,
                                    borderColor: '#fff',
                                    borderWidth: 3,
                                },
                                label: {
                                    formatter: '{b}\n({d}%)',
                                },
                                data: [
                                    { name: chartData.home_team, value: chartData.home_value },
                                    { name: chartData.away_team, value: chartData.away_value },
                                ],
                            },
                        ],
                    }}
                />
            )}
        </div>
    );
};


export default MatchFeaturePieChart;
