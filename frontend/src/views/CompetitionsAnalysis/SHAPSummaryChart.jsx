import ReactECharts from 'echarts-for-react';
import PropTypes from 'prop-types';


const SHAPSummaryChart = ({ data, className, competitionName }) => {
  if (!data || !Array.isArray(data)) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando datos...</div>;
  }

  const sorted = [...data].sort((a, b) => {
    const meanAbs = arr => arr.reduce((sum, val) => sum + Math.abs(val), 0) / arr.length;
    return meanAbs(b.shap_values) - meanAbs(a.shap_values);
  });

  const yLabels = sorted.map(d => d.feature_name);

  const scatterData = [];
  sorted.forEach((feature, featureIndex) => {
    const featureMin = Math.min(...feature.feature_values);
    const featureMax = Math.max(...feature.feature_values);
    feature.shap_values.forEach((shapVal, i) => {
      const val = feature.feature_values[i];
      const norm = (val - featureMin) / (featureMax - featureMin + 1e-8);
      let color;
      if (norm <= 0.5) {
        const ratio = norm / 0.5;
        color = `rgb(${Math.round(128 * ratio)}, 0, ${255 - Math.round(127 * ratio)})`;
      } else {
        const ratio = (norm - 0.5) / 0.5;
        color = `rgb(255, 0, ${128 - Math.round(128 * ratio)})`;
      }
      scatterData.push({
        value: [shapVal, featureIndex],
        tooltipData: { val, shapVal, featureName: feature.feature_name },
        itemStyle: { color }
      });
    });
  });

  const chartHeight = Math.max(400, sorted.length * 40);

  return (
    <ReactECharts
      style={{ width: '100%', height: `${chartHeight}px` }}
      option={{
        title: {
          text: `${competitionName} - Influencia local de las características: ${className}`,
          left: 'center',
          textStyle: {
            fontSize: 20,
            fontWeight: '800',
            fontFamily: 'Arial, sans-serif',
          },
        },
        grid: { left: 300, right: 100, top: 50, bottom: 50 },
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
          data: yLabels,
          inverse: true,
          axisLabel: {
            fontSize: 12,
          },
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        visualMap: {
          type: 'continuous',
          calculable: false,
          orient: 'vertical',
          right: 20,
          top: 'middle',
          inRange: {
            color: ['blue', 'purple', 'red'],
          },
          text: ['Alto', 'Bajo'],
          itemHeight: 450,
          itemWidth: 15,
          textStyle: {
            fontSize: 12,
            color: '#000'
          },
          formatter: () => '',
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            const data = params.data.tooltipData;
            return `
          <strong>${data.featureName}</strong><br/>
          Valor de la característica: ${data.val.toFixed(4)}<br/>
          Valor SHAP: ${data.shapVal.toFixed(4)}
        `;
          }
        },
        series: [
          {
            name: 'Impacto SHAP',
            type: 'scatter',
            data: scatterData,
            symbolSize: 8,
          }
        ]
      }}
    />
  );
};

SHAPSummaryChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      feature_name: PropTypes.string,
      shap_values: PropTypes.arrayOf(PropTypes.number),
      feature_values: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  className: PropTypes.string.isRequired,
  competitionName: PropTypes.string.isRequired,
};


export default SHAPSummaryChart;
