import React from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from 'prop-types';


const MatchSHAPSummaryChart = ({ data }) => {
    if (!data || !data.top_features) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Sin datos disponibles</div>;
    }

    const features = data.top_features.map(f => f.feature_name);
    const values = data.top_features.map(f => Math.abs(f.shap_value));
    const colors = data.top_features.map(f => f.shap_value >= 0 ? '#24754d' : '#c62828');

    return (
        <ReactECharts
            style={{ width: '100%', height: '500px' }}
            option={{
                title: {
                    text: `${data.class} (Prob: ${(data.probability * 100).toFixed(2)}%)`,
                    left: 'center',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: '800',
                        fontFamily: 'Arial, sans-serif',
                    },
                },
                grid: { left: 320, right: 5, top: 70, bottom: 50 },
                xAxis: {
                    type: 'value',
                    name: 'Impacto SHAP',
                    nameLocation: 'middle',
                    nameGap: 30,
                    nameTextStyle: {
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                yAxis: {
                    type: 'category',
                    data: features,
                    inverse: true,
                    axisLabel: {
                        fontSize: 13,
                        lineHeight: 20,
                        interval: 0,
                        overflow: 'truncate',
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}',
                },
                series: [
                    {
                        type: 'bar',
                        data: values.map((val, idx) => ({
                            value: val,
                            itemStyle: { color: colors[idx] },
                        })),
                        itemStyle: { borderRadius: [0, 6, 6, 0] },
                    }
                ],
            }}
        />
    );
};

MatchSHAPSummaryChart.propTypes = {
    data: PropTypes.object.isRequired,
};


export default MatchSHAPSummaryChart;
