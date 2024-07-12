import { cilWallpaper } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChart } from '@coreui/react-chartjs';
import { CWidgetStatsD } from '@coreui/react-pro';
import { getNonGridLineChartOptions } from 'components/chart/options/getNonGridLineChartOptions';
import { calculateGrowthRateWithIcon, findPaddedMaxMin } from 'utils/chart/ChartStatisticsProcessor';
import MonthLabelGenerator from 'utils/common/MonthLabelGenerator';

export const DallE3GenerationChart = ({ statisticsData }) => {
  const { paddedMax, paddedMin } = findPaddedMaxMin(statisticsData);
  return (
    <CWidgetStatsD
      className="mb-4"
      {...{
        chart: (
          <CChart
            className="position-absolute w-100 h-100"
            type="line"
            data={{
              labels: MonthLabelGenerator.pastYearMonthsChartLabels(),
              datasets: [
                {
                  label: '응답 횟수',
                  backgroundColor: 'rgba(255,255,255,.1)',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  data: statisticsData,
                  fill: true,
                },
              ],
            }}
            options={getNonGridLineChartOptions({
              scales: {
                x: {
                  display: false,
                },
                y: {
                  display: false,
                  min: paddedMin,
                  max: paddedMax,
                },
              },
            })}
          />
        ),
      }}
      icon={<CIcon icon={cilWallpaper} height={52} className="my-4 text-white" />}
      values={[
        { title: 'DallE 3 생성 횟수', value: `${statisticsData[11]} 회` },
        {
          title: '전월 대비',
          value: calculateGrowthRateWithIcon(statisticsData[10], statisticsData[11]),
        },
      ]}
      style={{
        '--cui-card-cap-bg': '#6F42C1',
      }}
    />
  );
};
