import React from 'react';

import { CChart } from '@coreui/react-chartjs';
import chartPastYearMonthsLabels from 'components/chart/chartPastYearMonthsLabels';
import { getCoreUILineChartOptions } from 'components/chart/options/getCoreUILineChartOptions';

export const InputTokenChart = (statisticsData) => {
  return (
    <>
      {/*REMIND 커버 구현하기 <CElementCover />*/}
      <CChart
        style={{ height: '200px' }}
        type="line"
        data={{
          labels: chartPastYearMonthsLabels(),
          datasets: [
            {
              label: 'Input Tokens',
              backgroundColor: 'rgba(151, 187, 205, 0.2)',
              borderColor: 'rgba(151, 187, 205, 1)',
              pointBackgroundColor: 'rgba(151, 187, 205, 1)',
              pointBorderColor: '#fff',
              data: statisticsData,
            },
          ],
        }}
        options={getCoreUILineChartOptions}
      />
    </>
  );
};
