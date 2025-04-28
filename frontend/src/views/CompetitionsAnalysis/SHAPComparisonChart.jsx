import React from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';


const LEAGUES = [
  { id: 'LaLiga', name: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 'PremierLeague', name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 'SerieA', name: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: 'Ligue1', name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  { id: '1Bundesliga', name: '1. Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { id: 'Top5', name: 'Las cinco grandes ligas', logo: 'https://e7.pngegg.com/pngimages/463/615/png-clipart-europe-map-map-world-map.png' },
];

const SHAPComparisonChart = ({ data, selectedFeatureName, currentClassIndex }) => {
  if (!data || !Array.isArray(data)) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando comparación...</div>;
  }

  const classes = ["Victoria del equipo visitante", "Empate", "Victoria del equipo local"];
  const selectedClassName = classes[currentClassIndex];

  const leaguesInfo = data.map(d => {
    const foundLeague = LEAGUES.find(l => l.id === d.league);
    return foundLeague
      ? { name: foundLeague.name, logo: foundLeague.logo }
      : { name: d.league, logo: '' };
  });

  const scatterData = [];

  data.forEach((leagueData, leagueIndex) => {
    const classInfo = leagueData.classes.find(cls => cls.class === selectedClassName);
    if (classInfo) {
      const featureMin = Math.min(...classInfo.feature_values);
      const featureMax = Math.max(...classInfo.feature_values);

      classInfo.shap_values.forEach((shapVal, idx) => {
        const featureVal = classInfo.feature_values[idx];
        const normalized = (featureVal - featureMin) / (featureMax - featureMin + 1e-8);

        let color;
        if (normalized <= 0.5) {
          const ratio = normalized / 0.5;
          color = `rgb(${Math.round(128 * ratio)}, 0, ${255 - Math.round(127 * ratio)})`;
        } else {
          const ratio = (normalized - 0.5) / 0.5;
          color = `rgb(255, 0, ${128 - Math.round(128 * ratio)})`;
        }

        scatterData.push({
          value: [shapVal, leagueIndex],
          tooltipData: { featureVal, shapVal, league: leaguesInfo[leagueIndex].name },
          itemStyle: { color }
        });
      });
    }
  });

  const chartHeight = Math.max(400, leaguesInfo.length * 80);

  const yAxisLabels = leaguesInfo.map((league, index) => {
    return `{img${index}|} {name${index}|${league.name}}`;
  });

  const rich = {};
  leaguesInfo.forEach((league, index) => {
    rich[`img${index}`] = {
      height: 40,
      width: 40,
      align: 'center',
      backgroundColor: {
        image: league.logo,
      }
    };
    rich[`name${index}`] = {
      fontSize: 14,
      color: '#333',
      align: 'left',
      padding: [0, 6, 0, 6],
    };
  });

  return (
    <ReactECharts
      style={{ width: '100%', height: `${chartHeight}px` }}
      option={{
        title: {
          text: `${selectedFeatureName} - ${selectedClassName}`,
          left: 'center',
          textStyle: {
            fontSize: 20,
            fontWeight: '800',
            fontFamily: 'Arial, sans-serif',
          },
        },
        grid: { left: 320, right: 70, top: 50, bottom: 50 },
        xAxis: {
          type: 'value',
          name: 'Impacto local sobre el resultado',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          axisLabel: {
            formatter: (value) => value,
            rich: rich,
            fontSize: 14,
            margin: 20,
          },
          data: yAxisLabels,
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const d = params.data.tooltipData;
            return `
              <strong>${d.league}</strong><br/>
              Valor de la característica: ${d.featureVal.toFixed(4)}<br/>
              Valor SHAP: ${d.shapVal.toFixed(4)}
            `;
          }
        },
        visualMap: {
          type: 'continuous',
          calculable: false,
          orient: 'vertical',
          right: 10,
          top: 'middle',
          inRange: {
            color: ['blue', 'purple', 'red'],
          },
          text: ['Alto', 'Bajo'],
          itemHeight: 300,
          itemWidth: 15,
          textStyle: {
            fontSize: 12,
            color: '#000'
          },
          formatter: () => '',
        },
        series: [
          {
            type: 'scatter',
            data: scatterData,
            symbolSize: 8,
          }
        ]
      }}
    />
  );
};

SHAPComparisonChart.propTypes = {
  data: PropTypes.array.isRequired,
  selectedFeatureName: PropTypes.string.isRequired,
  currentClassIndex: PropTypes.number.isRequired,
};


export default SHAPComparisonChart;
