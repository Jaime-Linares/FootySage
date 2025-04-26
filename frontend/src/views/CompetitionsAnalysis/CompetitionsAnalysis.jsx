import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getGraphExplanation, getFeatureExplanation } from '../../utils/graphExplanations';
import CustomButton from '../../components/CustomButton';
import FootballLogo from '../../components/FootballLogo';
import MessageBanner from '../../components/MessageBanner';
import CustomModal from '../../components/CustomModal';
import FeatureImportanceChart from './FeatureImportanceChart';
import SHAPSummaryChart from './SHAPSummaryChart';
import './styles/CompetitionsAnalysis.css';


const LEAGUES = [
  { id: 'LaLiga', name: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 'PremierLeague', name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 'SerieA', name: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: 'Ligue1', name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  { id: '1Bundesliga', name: '1. Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { id: 'Top5', name: 'Las cinco grandes ligas', logo: 'https://e7.pngegg.com/pngimages/463/615/png-clipart-europe-map-map-world-map.png' },
];

const CompetitionsAnalysis = () => {
  const { accessToken } = useAuth();

  const [selectedLeague, setSelectedLeague] = useState('LaLiga');
  const [chartsData, setChartsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [message, setMessage] = useState({ message: '', type: '' });
  const [selectedType, setSelectedType] = useState('global');
  const [isLoading, setIsLoading] = useState(false);

  const hasMultipleCharts = () => {
    if (selectedType === 'global') {
      if (selectedLeague === 'Top5' || selectedLeague === '1Bundesliga' || selectedLeague === 'Ligue1') {
        return false;
      } else {
        return true
      }
    } else if (selectedType === 'shap') {
      return true;
    }
    return false;
  };

  const fetchLeagueData = useCallback(async (league, type) => {
    setIsLoading(true);
    setChartsData([]);
    setCurrentIndex(0);
    setMessage({ message: '', type: '' });

    const url = type === 'global'
      ? `${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/global_feature_importance/?league=${league}`
      : `${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/shap_scatter_data/?league=${league}`;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setChartsData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage({ message: 'Debes iniciar sesión para ver este análisis', type: 'error' });
      } else {
        setMessage({ message: 'Error al cargar los datos. Inténtalo más tarde', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    fetchLeagueData(selectedLeague, selectedType);
  }, [selectedLeague, selectedType, accessToken, fetchLeagueData]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % chartsData.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + chartsData.length) % chartsData.length);

  const renderChart = () => {
    const competitionName = LEAGUES.find(l => l.id === selectedLeague)?.name;
    if (selectedType === 'global') {
      const current = chartsData[currentIndex];
      const data = current.importances || chartsData;
      const isLogistic = Array.isArray(current.importances);

      return (
        <FeatureImportanceChart
          data={data}
          title={
            isLogistic
              ? `${competitionName} - Influencia global de las características: ${current.class}`
              : `${competitionName} - Influencia global de las características`
          }
          type={isLogistic ? 'logistic' : 'random_forest'}
        />
      );
    } else if (selectedType === 'shap' && chartsData.length > 0) {
      return (
        <SHAPSummaryChart
          data={chartsData[currentIndex].data}
          className={chartsData[currentIndex].class}
          competitionName={competitionName}
        />
      );
    }
  };

  return (
    <>
      <div className="competitions-analysis-container competitions-analysis-fade-in">
        <h1 className="competitions-analysis-title">Análisis de competiciones</h1>
        <MessageBanner message={message.message} type={message.type} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
          <CustomButton
            title="¿Qué significa cada gráfico?"
            onPress={() => setShowExplanationModal(true)}
            textStyle={{ color: 'white', fontWeight: '800', fontSize: '17px' }}
          />
          <CustomButton
            title="¿Qué significa cada característica?"
            onPress={() => setShowFeaturesModal(true)}
            textStyle={{ color: 'white', fontWeight: '800', fontSize: '17px' }}
          />
        </div>

        <div className="tabs-leagues">
          {LEAGUES.map((league) => (
            <div
              key={league.id}
              className={`tab-league ${selectedLeague === league.id ? 'tab-league-selected' : ''}`}
              onClick={() => setSelectedLeague(league.id)}
            >
              <FootballLogo src={league.logo} alt={league.name} />
              <span>{league.name}</span>
            </div>
          ))}
        </div>

        <div className="tabs-type">
          <div
            className={`tab-type ${selectedType === 'global' ? 'tab-type-selected' : ''}`}
            onClick={() => setSelectedType('global')}
          >
            Influencia global de las características
          </div>
          <div
            className={`tab-type ${selectedType === 'shap' ? 'tab-type-selected' : ''}`}
            onClick={() => setSelectedType('shap')}
          >
            Influencia local de las características
          </div>
        </div>

        {isLoading ? (
          <div className="chart-loading-spinner">
            <div className="spinner" />
          </div>
        ) : (
          !message.message && chartsData.length > 0 && (
            <div className="chart-carousel">
              {hasMultipleCharts() && (
                <CustomButton
                  title={<FaChevronLeft color='var(--color-green)' size={60} />}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
              {renderChart()}
              {hasMultipleCharts() && (
                <CustomButton
                  title={<FaChevronRight color='var(--color-green)' size={60} />}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
            </div>
          )
        )}
      </div>
      <CustomModal isOpen={showExplanationModal} onClose={() => setShowExplanationModal(false)} width="1100px">
        {getGraphExplanation()}
      </CustomModal>
      <CustomModal isOpen={showFeaturesModal} onClose={() => setShowFeaturesModal(false)} width="1100px">
        {getFeatureExplanation()}
      </CustomModal>
    </>
  );
};


export default CompetitionsAnalysis;
