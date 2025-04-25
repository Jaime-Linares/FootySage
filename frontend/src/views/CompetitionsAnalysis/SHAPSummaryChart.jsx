import ReactECharts from 'echarts-for-react';
import PropTypes from 'prop-types';

const SHAPSummaryChart = ({ data, className }) => {
  if (!data || !Array.isArray(data)) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando datos...</div>;
  }

  const sorted = [...data].sort((a, b) => {
    const meanAbs = arr => arr.reduce((sum, val) => sum + Math.abs(val), 0) / arr.length;
    return meanAbs(b.shap_values) - meanAbs(a.shap_values);
  });

  const yLabels = sorted.map(d => d.feature_name);
  const scatterData = sorted.map((d, idx) =>
    d.shap_values.map((val, i) => [val, d.feature_values[i], idx])
  ).flat();

  const allFeatureVals = sorted.flatMap(f => f.feature_values);
  const minVal = Math.min(...allFeatureVals);
  const maxVal = Math.max(...allFeatureVals);

  const chartHeight = Math.max(400, sorted.length * 28);

  return (
    <ReactECharts
      style={{ width: '100%', height: `${chartHeight}px` }}
      option={{
        title: {
          text: `Influencia local - ${className}`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        },
        grid: { left: 300, right: 70, top: 50, bottom: 50 },
        xAxis: {
          type: 'value',
          name: 'Impacto sobre el resultado',
          nameLocation: 'middle',
          nameGap: 30,
        },
        yAxis: {
          type: 'category',
          data: yLabels,
          inverse: true,
          axisLabel: {
            fontSize: 12,
          },
        },
        visualMap: {
          type: 'continuous',
          min: minVal,
          max: maxVal,
          dimension: 1,
          orient: 'vertical',
          right: 20,
          top: 'middle',
          inRange: {
            color: ['blue', 'purple', 'red']
          },
          text: ['Alto', 'Bajo'],
          calculable: true,
          itemHeight: 150,
          itemWidth: 14,
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            const feature = yLabels[params.data[2]];
            return `
              <strong>${feature}</strong><br/>
              Valor de la característica: ${params.data[1]}<br/>
              Valor SHAP: ${params.data[0].toFixed(4)}
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
};

export default SHAPSummaryChart;
