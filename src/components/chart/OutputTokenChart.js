import React from 'react';

import { CChart } from '@coreui/react-chartjs';
import { getCoreUILineChartOptions } from 'components/chart/options/getCoreUILineChartOptions';
import { chartPastYearMonthsLabels } from 'components/chart/utils/chartPastYearMonthsLabels';
import { padDataArrayWithZero } from 'components/chart/utils/ChartStatisticsProcessor';

export const OutputTokenChart = (statisticsData) => {
  const paddedArray = padDataArrayWithZero(statisticsData.data);
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
            data: paddedArray,
          },
        ],
      }}
      options={getCoreUILineChartOptions}
    />
  );
};
