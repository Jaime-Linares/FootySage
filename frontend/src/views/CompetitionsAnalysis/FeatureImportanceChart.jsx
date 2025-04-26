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

    const getLegendGraphic = () => {
        if (type === 'random_forest') {
            return [
                {
                    type: 'group',
                    left: 'center',
                    top: 50,
                    children: [
                        {
                            type: 'group',
                            left: 0,
                            top: 0,
                            children: [
                                {
                                    type: 'rect',
                                    shape: { width: 12, height: 12 },
                                    style: { fill: '#1e88e5' },
                                },
                                {
                                    type: 'text',
                                    left: 20,
                                    style: {
                                        text: 'Influencia en general (ni positiva ni negativa)',
                                        fill: '#000',
                                        fontSize: 13,
                                        fontWeight: '700',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ];
        } else if (type === 'logistic') {
            return [
                {
                    type: 'group',
                    left: 'center',
                    top: 50,
                    children: [
                        {
                            type: 'group',
                            left: 0,
                            top: 0,
                            children: [
                                {
                                    type: 'rect',
                                    shape: { width: 12, height: 12 },
                                    style: { fill: '#c62828' },
                                },
                                {
                                    type: 'text',
                                    left: 20,
                                    style: {
                                        text: 'Influye negativamente',
                                        fill: '#000',
                                        fontSize: 13,
                                        fontWeight: '700',
                                    },
                                },
                            ],
                        },
                        {
                            type: 'group',
                            left: 220,
                            top: 0,
                            children: [
                                {
                                    type: 'rect',
                                    shape: { width: 12, height: 12 },
                                    style: { fill: '#24754d' },
                                },
                                {
                                    type: 'text',
                                    left: 20,
                                    style: {
                                        text: 'Influye positivamente',
                                        fill: '#000',
                                        fontSize: 13,
                                        fontWeight: '700',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ];
        }
        return [];
    };


    return (
        <ReactECharts
            ref={chartRef}
            style={{ height: Math.max(400, data.length * 30), width: '100%' }}
            option={{
                title: {
                    text: title, left: 'center',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: '800',
                        fontFamily: 'Arial, sans-serif',
                    },
                },
                tooltip: { trigger: 'item' },
                grid: { left: 350, right: 10, top: 80, bottom: 50 },
                xAxis: {
                    type: 'value',
                    name: 'Importancia global sobre el resultado',
                    nameLocation: 'middle',
                    nameGap: 30,
                    nameTextStyle: {
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                yAxis: {
                    type: 'category',
                    data: featureLabels,
                    inverse: true,
                    axisLabel: {
                        fontSize: 13,
                        lineHeight: 20,
                        interval: 0,
                        overflow: 'truncate',
                    },
                },
                graphic: getLegendGraphic(),
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
