import React from 'react';

import { CChart } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';
import chartPastYearMonthsLabels from 'components/chart/chartPastYearMonthsLabels';

export const OutputTokenChart = (statisticsData) => {
  return (
    <CChart
      type="line"
      data={{
        labels: chartPastYearMonthsLabels(),
        datasets: [
          {
            label: 'Output Tokens', // 범례
            backgroundColor: 'rgba(220, 220, 220, 0.2)',
            borderColor: 'rgba(220, 220, 220, 1)',
            pointBackgroundColor: 'rgba(220, 220, 220, 1)',
            pointBorderColor: '#fff',
            data: statisticsData,
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            labels: {
              color: getStyle('--cui-body-color'),
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
          y: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
        },
      }}
    />
  );
};
