import { cilCommentSquare } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChart } from '@coreui/react-chartjs';
import { CWidgetStatsD } from '@coreui/react-pro';
import chartPastYearMonthsLabels from 'components/chart/chartPastYearMonthsLabels';
import { findMinMax, padDataArrayWithZero } from 'components/chart/ChartStatisticsProcessor';
import { getNonGridLineChartOptions } from 'components/chart/options/getNonGridLineChartOptions';

const chartOptions = {
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
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      min: -20, // 차트에 표시될 데이터 값의 하한
      max: 30,
      display: false,
    },
  },
};

export const DallE3GenerationChart = (statisticsData) => {
  const paddedArray = padDataArrayWithZero(statisticsData.data);
  const { minData, maxData } = findMinMax(paddedArray);

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
      icon={<CIcon icon={cilCommentSquare} height={52} className="my-4 text-white" />}
      values={[
        { title: 'DallE 3 답변 횟수', value: paddedArray[11] },
        {
          title: '전월 대비',
          value:
            paddedArray[10] === 0
              ? `${paddedArray[11] * 100}%`
              : `${(((paddedArray[11] - paddedArray[10]) / paddedArray[10]) * 100).toFixed(2)}%`,
        },
      ]}
      style={{
        '--cui-card-cap-bg': '#6F42C1',
      }}
    />
  );
};
