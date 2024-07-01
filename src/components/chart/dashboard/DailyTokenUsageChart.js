import { CChart } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';

export const DailyTokenUsageChart = () => {
  const dailyTokenUsagesExample = [
    { title: 'Monday', InputTokens: 34, OutputTokens: 78 },
    { title: 'Tuesday', InputTokens: 56, OutputTokens: 94 },
    { title: 'Wednesday', InputTokens: 12, OutputTokens: 67 },
    { title: 'Thursday', InputTokens: 43, OutputTokens: 91 },
    { title: 'Friday', InputTokens: 22, OutputTokens: 73 },
    { title: 'Saturday', InputTokens: 53, OutputTokens: 82 },
    { title: 'Sunday', InputTokens: 9, OutputTokens: 69 },
  ];
  const dailyTokenUsagesExampleLabels = dailyTokenUsagesExample.map((item) => item.title);
  const dailyTokenUsagesExampleInputToken = dailyTokenUsagesExample.map((item) => item.InputTokens);
  const dailyTokenUsagesExampleOutputToken = dailyTokenUsagesExample.map((item) => item.OutputTokens);

  //REMIND 매일 차트 라벨 변경해서, 가장 마지막 요일이 오늘이 되도록
  return (
    <CChart
      type="bar"
      data={{
        labels: dailyTokenUsagesExampleLabels,
        datasets: [
          {
            label: 'Input Tokens',
            backgroundColor: '#007bff',
            data: dailyTokenUsagesExampleInputToken,
          },
          {
            label: 'Output Tokens',
            backgroundColor: '#dc3545',
            data: dailyTokenUsagesExampleOutputToken,
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
