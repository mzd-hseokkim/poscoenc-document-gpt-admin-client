import { cilWallpaper } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChart } from '@coreui/react-chartjs';
import { CWidgetStatsD } from '@coreui/react-pro';
import { getNonGridLineChartOptions } from 'components/chart/options/getNonGridLineChartOptions';
import { chartPastYearMonthsLabels } from 'components/chart/utils/chartPastYearMonthsLabels';
import { calculateGrowthRateWithIcon, padDataArrayWithZero } from 'components/chart/utils/ChartStatisticsProcessor';

export const DallE3GenerationChart = (statisticsData) => {
  const paddedArray = padDataArrayWithZero(statisticsData.data);

  return (
    <CWidgetStatsD
      className="mb-4"
      {...{
        chart: (
          <CChart
            className="position-absolute w-100 h-100"
            type="line"
            data={{
              labels: chartPastYearMonthsLabels(),
              datasets: [
                {
                  label: '응답 횟수',
                  backgroundColor: 'rgba(255,255,255,.1)',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  data: paddedArray,
                  fill: true,
                },
              ],
            }}
            options={getNonGridLineChartOptions()}
          />
        ),
      }}
      icon={<CIcon icon={cilWallpaper} height={52} className="my-4 text-white" />}
      values={[
        { title: 'DallE 3 생성 횟수', value: `${paddedArray[11]} 회` },
        {
          title: '전월 대비',
          value: calculateGrowthRateWithIcon(paddedArray[10], paddedArray[11]),
        },
      ]}
      style={{
        '--cui-card-cap-bg': '#6F42C1',
      }}
    />
  );
};
