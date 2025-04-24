import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';


const FeatureImportanceChart = ({ data, title, type }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      chartRef.current?.getEchartsInstance().resize();
    }, 100);
  }, [data]);

  const getColor = (value) => {
    if (type === 'random_forest') return '#1e88e5';
    if (value > 0) return '#24754d';
    return '#c62828';
  };

  const formattedData = data
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .map(d => ({
      value: Math.abs(d.value),
      itemStyle: { color: getColor(d.value) },
    }));

  const featureLabels = data
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .map(d => d.feature_name);

  return (
    <ReactECharts
      ref={chartRef}
      style={{ height: Math.max(400, data.length * 28), width: '100%' }}
      option={{
        title: { text: title, left: 'center' },
        tooltip: { trigger: 'item' },
        grid: { left: 320, right: 30, top: 50, bottom: 50 },
        xAxis: { type: 'value', name: 'Importancia' },
        yAxis: {
          type: 'category',
          data: featureLabels,
          inverse: true,
          axisLabel: {
            fontSize: 12,
            lineHeight: 16,
            interval: 0,
            overflow: 'truncate',
          },
        },
        series: [
          {
            type: 'bar',
            data: formattedData,
            itemStyle: { borderRadius: [0, 6, 6, 0] },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            }
          }
        ]
      }}
    />
  );
};

FeatureImportanceChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['logistic', 'random_forest']).isRequired,
};


export default FeatureImportanceChart;
