import React from 'react';

import { CChartLine } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';
import { monthlyLabel, weeklyLabel } from 'components/chart/utils/ChartLabel';

export const DocumentCollectionTopEntriesChart = ({ hotConChartLabelOption, chartData }) => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const randomSevenElementsChartData1 = [
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
  ];

  const randomSevenElementsChartData2 = [
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
  ];

  const randomSevenElementsChartData3 = [
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
  ];

  const randomSevenElementsChartData = [
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
    random(50, 200),
  ];
  return (
    <CChartLine
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels: hotConChartLabelOption === 'days' ? weeklyLabel : monthlyLabel,
        datasets: [
          {
            label: 'Marl-E CMS in POSCO Corp.',
            // backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-info'),
            pointHoverBackgroundColor: getStyle('--cui-info'),
            borderWidth: 2,
            data: randomSevenElementsChartData,
            fill: true,
          },
          {
            label: 'Marl-E CMS in MZC.',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-success'),
            pointHoverBackgroundColor: getStyle('--cui-success'),
            borderWidth: 2,
            data: randomSevenElementsChartData1,
          },
          {
            label: 'Marl-E CMS in Government',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-danger'),
            pointHoverBackgroundColor: getStyle('--cui-danger'),
            borderWidth: 2,
            // borderDash: [8, 5],
            data: [65, 65, 65, 65, 65, 65, 65],
          },
          {
            label: 'Marl-E CMS 개발 인력 재검토',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-danger'),
            pointHoverBackgroundColor: getStyle('--cui-success'),
            borderWidth: 2,
            data: randomSevenElementsChartData2,
          },
          {
            label: 'Marl-E CMS SI 파견 검토',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-gray'),
            pointHoverBackgroundColor: getStyle('--cui-success'),
            borderWidth: 2,
            data: randomSevenElementsChartData3,
          },
          {
            label: 'Average',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-gray'),
            pointHoverBackgroundColor: getStyle('--cui-success'),
            borderWidth: 2,
            borderDash: [8, 5],
            data: [125, 125, 125, 125, 125, 125, 125],
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
              max: 250,
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
