import { getStyle } from '@coreui/utils';

export const getCoreUILineChartOptions = {
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
};
