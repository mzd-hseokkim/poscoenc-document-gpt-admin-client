import React from 'react';

import { CChartLine } from '@coreui/react-chartjs';
import { getStyle, hexToRgba } from '@coreui/utils';
import { mergeAndSumArrays } from 'components/chart/utils/ChartStatisticsProcessor';

export const TotalTokenUsageChart = ({ totalTokenUsageChartLabelOption }) => {
  const lastSixMonthLabel = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const weeklyLabel = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const randomInputTokenChartData = [
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
  ];
  const randomOutputTokenChartData = [
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
  ];
  const totalChartDataInTotalTokenUsage = mergeAndSumArrays(randomInputTokenChartData, randomOutputTokenChartData);

  const dailyTokenUsagesExample = [
    { title: 'Monday', InputTokens: 34, OutputTokens: 78 },
    { title: 'Tuesday', InputTokens: 56, OutputTokens: 94 },
    { title: 'Wednesday', InputTokens: 12, OutputTokens: 67 },
    { title: 'Thursday', InputTokens: 43, OutputTokens: 91 },
    { title: 'Friday', InputTokens: 22, OutputTokens: 73 },
    { title: 'Saturday', InputTokens: 53, OutputTokens: 82 },
    { title: 'Sunday', InputTokens: 9, OutputTokens: 69 },
  ];

  return (
    <CChartLine
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels: totalTokenUsageChartLabelOption === 'days' ? weeklyLabel : lastSixMonthLabel,
        datasets: [
          {
            label: 'Total',
            backgroundColor: hexToRgba(getStyle('--cui-success'), 10),
            borderColor: getStyle('--cui-success'),
            pointHoverBackgroundColor: getStyle('--cui-success'),
            borderWidth: 2,
            data: totalChartDataInTotalTokenUsage,
            fill: true,
          },
          {
            label: 'Input Tokens',
            backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
            borderColor: getStyle('--cui-info'),
            pointHoverBackgroundColor: getStyle('--cui-info'),
            borderWidth: 2,
            data: randomInputTokenChartData,
            fill: true,
          },
          {
            label: 'Output Tokens',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-warning'),
            pointHoverBackgroundColor: getStyle('--cui-warning'),
            borderWidth: 2,
            data: randomOutputTokenChartData,
          },
          {
            label: 'Maximum Token Usage',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-danger'),
            pointHoverBackgroundColor: getStyle('--cui-danger'),
            borderWidth: 1,
            borderDash: [8, 5],
            data: [380, 380, 380, 380, 380, 380, 380],
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              drawOnChartArea: false,
            },
          },
          y: {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              stepSize: Math.ceil(250 / 5),
              max: 300,
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      }}
    />
  );
};
