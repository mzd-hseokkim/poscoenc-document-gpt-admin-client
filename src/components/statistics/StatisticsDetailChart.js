import { CChart } from '@coreui/react-chartjs';
import { CCard, CCardBody, CCardHeader } from '@coreui/react-pro';
import { getStyle } from '@coreui/utils';

const StatisticsDetailChart = ({ chartData }) => {
  return (
    <>
      <CCard>
        <CCardHeader>
          <h2>기준 : {chartData.aggregationName}</h2>
          <h6>AggregationCount : {chartData.aggregationCount}</h6>
        </CCardHeader>
        <CCardBody>
          <CChart
            type="doughnut"
            data={{
              labels: ['Input Tokens', 'Output Tokens', 'Bing Searchs', 'DallE3 Generations'],
              datasets: [
                {
                  backgroundColor: ['#FFC107', '#E91E63', '#0078d4', '#6F42C1'],
                  data: [
                    chartData.sumInputTokens,
                    chartData.sumOutputTokens,
                    chartData.sumBingSearchs,
                    chartData.sumDallE3Generations,
                  ],
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
            }}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

export default StatisticsDetailChart;
