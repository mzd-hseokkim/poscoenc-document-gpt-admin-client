export const getNonGridLineChartOptions = (yAxisMin = -10, yAxisMax = 30) => ({
  plugins: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      border: {
        display: false, //X 축 경계선 표시 안함
      },
      grid: {
        display: false, //X축 그리드 표시 안함
        drawBorder: false, //x 축 외곽선도 표시 안함
      },
      ticks: {
        display: false, //X 축 눈금 표시 안함
      },
    },
    y: {
      min: yAxisMin, // 차트에 표시될 데이터 값의 하한
      max: yAxisMax, // 상한
      display: false, //y축 표시 안함
      grid: {
        display: false, //y축 그리드 표시 안함
      },
      ticks: {
        display: false, // y축 눈금 표시 안함
      },
    },
  },
  elements: {
    // 차트 내 개별 요소들
    line: {
      borderWidth: 1, // 데이터 세트를 연결하는 선 두께
      // tension: 0.4, // 선의 긴장감(곡률) 설정
    },
    point: {
      radius: 4, // 데이터 포인트의 기본 반지름
      hoverRadius: 5.5, // 데이터 포인트의 호버 시 반지름
    },
  },
});
