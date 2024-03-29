import React from 'react';

import { CChart } from '@coreui/react-chartjs';
import { getCoreUILineChartOptions } from 'components/chart/options/getCoreUILineChartOptions';
import { chartPastYearMonthsLabels } from 'components/chart/utils/chartPastYearMonthsLabels';
import { padDataArrayWithZero } from 'components/chart/utils/ChartStatisticsProcessor';

export const InputTokenChart = (statisticsData) => {
  const paddedArray = padDataArrayWithZero(statisticsData.data);
  return (
    <>
      {/*REMIND 커버 구현하기 <CElementCover />*/}
      <CChart
        style={{ height: '200px' }}
        type="line"
        data={{
          labels: chartPastYearMonthsLabels(), // datasets 의 길이와 일치하는 배열을 가져야합니다.
          datasets: [
            {
              label: 'Input Tokens',
              backgroundColor: 'rgba(151, 187, 205, 0.2)',
              borderColor: 'rgba(151, 187, 205, 1)',
              pointBackgroundColor: 'rgba(151, 187, 205, 1)',
              pointBorderColor: '#fff',
              data: paddedArray,
            },
          ],
        }}
        options={getCoreUILineChartOptions}
      />
    </>
  );
};
