import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import CustomButton from '../../../components/CustomButton';
import MessageBanner from '../../../components/MessageBanner';
import MatchSHAPSummaryChart from './MatchSHAPSummaryChart';
import './styles/MatchAnalysis.css';


const MatchAnalysis = () => {
    const { league, match_id } = useParams();
    const { accessToken } = useAuth();

    const [matchInfo, setMatchInfo] = useState({ homeTeam: 'Equipo Local', awayTeam: 'Equipo Visitante', score: '2-0' });
    const [selectedType, setSelectedType] = useState('shap_summary');
    const [shapSummaryData, setShapSummaryData] = useState([]);
    const [currentClassIndex, setCurrentClassIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ message: '', type: '' });

    const fetchSHAPSummary = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/match_shap_summary/?league=${league}&match_id=${match_id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setShapSummaryData(res.data);
        } catch (error) {
            setMessage({ message: `Error cargando análisis del partido: ${error}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [league, match_id, accessToken]);

    useEffect(() => {
        if (accessToken && selectedType === 'shap_summary') {
            fetchSHAPSummary();
        }
    }, [selectedType, accessToken, fetchSHAPSummary]);

    const next = () => setCurrentClassIndex((prev) => (prev + 1) % shapSummaryData.length);
    const prev = () => setCurrentClassIndex((prev) => (prev - 1 + shapSummaryData.length) % shapSummaryData.length);

    return (
        <div className="match-analysis-container match-analysis-fade-in">
            <h1 className="match-analysis-title">Análisis del partido</h1>
            <MessageBanner message={message.message} type={message.type} />

            <h2 className="match-analysis-subtitle">
                {matchInfo.homeTeam} {matchInfo.score} {matchInfo.awayTeam}
            </h2>

            <div className="tabs-type">
                <div
                    className={`tab-type ${selectedType === 'shap_summary' ? 'tab-type-selected' : ''}`}
                    onClick={() => setSelectedType('shap_summary')}
                >
                    Resumen del aporte de las características a la predicción
                </div>
                <div
                    className={`tab-type ${selectedType === 'feature_comparison' ? 'tab-type-selected' : ''}`}
                    onClick={() => setSelectedType('feature_comparison')}
                >
                    Comparación de características
                </div>
            </div>

            {isLoading ? (
                <div className="chart-loading-spinner"><div className="spinner" /></div>
            ) : (
                selectedType === 'shap_summary' && shapSummaryData.length > 0 && (
                    <div className="chart-carousel">
                        <CustomButton
                            title={<FaChevronLeft color="var(--color-green)" size={60} />}
                            onPress={prev}
                            buttonStyle={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                padding: 0,
                                backgroundColor: 'var(--color-background)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '10px',
                            }}
                            textStyle={{
                                fontSize: '30px',
                                color: '#fff',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                        <MatchSHAPSummaryChart data={shapSummaryData[currentClassIndex]} />
                        <CustomButton
                            title={<FaChevronRight color="var(--color-green)" size={60} />}
                            onPress={next}
                            buttonStyle={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                padding: 0,
                                backgroundColor: 'var(--color-background)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: '10px',
                            }}
                            textStyle={{
                                fontSize: '30px',
                                color: '#fff',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>
                )
            )}
        </div>
    );
};


export default MatchAnalysis;
