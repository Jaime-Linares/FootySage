import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import FootballLogo from '../../components/FootballLogo';
import MessageBanner from '../../components/MessageBanner';
import CustomModal from '../../components/CustomModal';
import CustomSelectDropdown from '../../components/CustomSelectDropdown';
import { getGraphExplanation, getFeatureExplanation } from './graphExplanations';
import FeatureImportanceChart from './FeatureImportanceChart';
import SHAPSummaryChart from './SHAPSummaryChart';
import SHAPComparisonChart from './SHAPComparisonChart';
import DistributionPieChart from './DistributionPieChart';
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

  const [isLoading, setIsLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('LaLiga');
  const [chartsData, setChartsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [message, setMessage] = useState({ message: '', type: '' });
  const [selectedType, setSelectedType] = useState('global');

  const [commonFeatures, setCommonFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [comparisonType, setComparisonType] = useState('compare_feature');
  const [compareData, setCompareData] = useState(null);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  const [distributionOptions, setDistributionOptions] = useState([]);
  const [selectedDistributionFeature, setSelectedDistributionFeature] = useState(null);
  const [distributionData, setDistributionData] = useState(null);
  const [isLoadingDistribution, setIsLoadingDistribution] = useState(false);

  const hasMultipleCharts = () => {
    if (selectedType === 'global' && (selectedLeague === 'Top5' || selectedLeague === '1Bundesliga' || selectedLeague === 'Ligue1')) {
      return false;
    } else {
      return true;
    }
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
        headers: { Authorization: `Bearer ${accessToken}` },
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

  const fetchCommonFeatures = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/common_features/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const features = res.data.map(f => ({ label: f, value: f }));
      setCommonFeatures(features);
    } catch (error) {
      setMessage({ message: `Error cargando características comunes: ${error}`, type: 'error' });
    }
  }, [accessToken]);

  const fetchDistributionOptions = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/feature_compare_distribution_options/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const options = res.data.map(f => ({ label: f, value: f }));
      setDistributionOptions(options);
    } catch (error) {
      setMessage({ message: `Error cargando opciones de distribución: ${error}`, type: 'error' });
    }
  }, [accessToken]);

  const fetchComparisonData = useCallback(async (feature) => {
    if (!feature) return;
    setIsLoadingComparison(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/shap_compare_feature/?feature_name=${feature.value}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCompareData(res.data);
    } catch (error) {
      setMessage({ message: `Error cargando comparación: ${error}`, type: 'error' });
    } finally {
      setIsLoadingComparison(false);
    }
  }, [accessToken]);

  const fetchDistributionData = useCallback(async (feature) => {
    if (!feature) return;
    setIsLoadingDistribution(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/graphs/feature_compare_distribution/?feature_name=${feature.value}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setDistributionData(res.data);
    } catch (error) {
      setMessage({ message: `Error cargando distribución: ${error}`, type: 'error' });
    } finally {
      setIsLoadingDistribution(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchLeagueData(selectedLeague, selectedType);
      fetchCommonFeatures();
      fetchDistributionOptions();
    }
  }, [selectedLeague, selectedType, accessToken, fetchLeagueData, fetchCommonFeatures, fetchDistributionOptions]);

  useEffect(() => {
    if (selectedFeature && comparisonType === 'compare_feature') {
      fetchComparisonData(selectedFeature);
    }
  }, [selectedFeature, comparisonType, fetchComparisonData]);

  useEffect(() => {
    if (selectedDistributionFeature && comparisonType === 'otro') {
      fetchDistributionData(selectedDistributionFeature);
    }
  }, [selectedDistributionFeature, comparisonType, fetchDistributionData]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % chartsData.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + chartsData.length) % chartsData.length);

  const nextComparison = () => setCurrentComparisonIndex((prev) => (prev + 1) % 3);
  const prevComparison = () => setCurrentComparisonIndex((prev) => (prev - 1 + 3) % 3);

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
      {/* Modales */}
      <CustomModal isOpen={showExplanationModal} onClose={() => setShowExplanationModal(false)} width="1100px">
        {getGraphExplanation()}
      </CustomModal>
      <CustomModal isOpen={showFeaturesModal} onClose={() => setShowFeaturesModal(false)} width="1100px">
        {getFeatureExplanation()}
      </CustomModal>

      {/* Contenido principal */}
      <div className="competitions-analysis-container competitions-analysis-fade-in">
        {/* Título y mensaje */}
        <h1 className="competitions-analysis-title">Análisis de competiciones</h1>
        <MessageBanner message={message.message} type={message.type} />

        {/* Botones de ayuda */}
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

        {/* Tabs de ligas */}
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

        {/* Tabs de tipo de análisis */}
        <div className="tabs-type">
          <div className={`tab-type ${selectedType === 'global' ? 'tab-type-selected' : ''}`} onClick={() => setSelectedType('global')}>
            Influencia global de las características
          </div>
          <div className={`tab-type ${selectedType === 'shap' ? 'tab-type-selected' : ''}`} onClick={() => setSelectedType('shap')}>
            Influencia local de las características
          </div>
        </div>

        {/* Gráficos principales */}
        {isLoading ? (
          <div className="chart-loading-spinner"><div className="spinner" /></div>
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

        {/* Comparación entre competiciones */}
        <h2 className="competitions-analysis-subtitle">Comparación entre competiciones</h2>

        <div className="tabs-comparison-type">
          <div className={`tab-comparison-type ${comparisonType === 'compare_feature' ? 'tab-comparison-type-selected' : ''}`} onClick={() => setComparisonType('compare_feature')}>
            Influencia local de las características
          </div>
          <div className={`tab-comparison-type ${comparisonType === 'otro' ? 'tab-comparison-type-selected' : ''}`} onClick={() => setComparisonType('otro')}>
            Valor medio de una característica en un partido
          </div>
        </div>

        {/* Selector y gráficos de comparación */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CustomSelectDropdown
            options={comparisonType === 'compare_feature' ? commonFeatures : distributionOptions}
            onChange={comparisonType === 'compare_feature' ? setSelectedFeature : setSelectedDistributionFeature}
            placeholder="Selecciona una característica"
            style={{ width: '500px' }}
          />
        </div>

        {comparisonType === 'compare_feature' ? (
          isLoadingComparison ? (
            <div className="chart-loading-spinner"><div className="spinner" /></div>
          ) : (
            compareData && selectedFeature && (
              <div className="chart-carousel">
                <CustomButton
                  title={<FaChevronLeft color='var(--color-green)' size={60} />}
                  onPress={prevComparison}
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
                <SHAPComparisonChart
                  data={compareData}
                  selectedFeatureName={selectedFeature.label}
                  currentClassIndex={currentComparisonIndex}
                />
                <CustomButton
                  title={<FaChevronRight color='var(--color-green)' size={60} />}
                  onPress={nextComparison}
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
              </div>
            )
          )
        ) : (
          isLoadingDistribution ? (
            <div className="chart-loading-spinner"><div className="spinner" /></div>
          ) : (
            distributionData && selectedDistributionFeature && (
              <div className="chart-carousel">
                <DistributionPieChart
                  data={distributionData}
                  selectedFeatureName={selectedDistributionFeature.label}
                />
              </div>
            )
          )
        )}
      </div>
    </>
  );
};


export default CompetitionsAnalysis;
