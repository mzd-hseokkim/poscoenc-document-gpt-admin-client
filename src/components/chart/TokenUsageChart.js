import React from 'react';

import { CChart } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';
import { mergeAndSumArrays } from 'components/chart/utils/ChartStatisticsProcessor';
import MonthLabelGenerator from 'utils/common/MonthLabelGenerator';

export const TokenUsageChart = ({ inputTokenData, outputTokenData }) => {
  return (
    <CChart
      type="line"
      style={{ width: 650 }}
      data={{
        labels: MonthLabelGenerator.pastYearMonthsChartLabels(),
        datasets: [
          {
            label: 'Total', // 범례
            backgroundColor: 'rgba(220, 220, 220, 0.2)',
            borderColor: '#007bff',
            pointBackgroundColor: 'rgba(220, 220, 220, 1)',
            pointBorderColor: '#fff',
            data: mergeAndSumArrays(inputTokenData, outputTokenData),
          },
          {
            label: 'Input Tokens', // 범례
            backgroundColor: 'rgba(151, 187, 205, 0.2)',
            borderColor: '#28a745',
            pointBackgroundColor: 'rgba(151, 187, 205, 1)',
            pointBorderColor: '#fff',
            data: inputTokenData,
          },
          {
            label: 'Output Tokens', // 범례
            backgroundColor: 'rgba(220, 220, 220, 0.2)',
            borderColor: '#ffc107',
            pointBackgroundColor: 'rgba(220, 220, 220, 1)',
            pointBorderColor: '#fff',
            data: outputTokenData,
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
              display: false,
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
        elements: {
          line: {
            tension: 0.2,
          },
        },
      }}
    />
  );
};
