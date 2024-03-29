const padDataArrayWithZero = (data) => {
  return data.length < 12 ? new Array(12 - data.length).fill(0).concat(data) : data;
};
const findMinMax = (array) => {
  let min = array[0];
  let max = array[0];

  for (let i = 1; i < array.length; i += 1) {
    if (array[i] < min) min = array[i];
    if (array[i] > max) max = array[i];
  }
  return { min, max };
};

const mergeAndSumArrays = (array1, array2) => {
  const resultArray = [];
  for (let i = 0; i < 12; i += 1) {
    resultArray[i] = array1[i] + array2[i];
  }
  return resultArray;
};

const calculateGrowthRateWithIcon = (prevMonthValue, currentMonthValue) => {
  if (prevMonthValue === 0) {
    // 이전 달의 값이 0이면 100% 증가로 간주하고 아이콘을 붙이지 않습니다.
    return `${100}% ↑`;
  } else {
    const growthRate = ((currentMonthValue - prevMonthValue) / prevMonthValue) * 100;
    const formattedGrowthRate = `${growthRate}%`;
    let icon = ''; // 기본적으로 아이콘은 비어있음

    // 증감률에 따라 아이콘을 결정합니다.
    if (growthRate > 0) {
      icon = ' ↑'; // 증가
    } else if (growthRate < 0) {
      icon = ' ↓'; // 감소
    } else {
      icon = ' -'; // 변동 없음
    }

    return formattedGrowthRate + icon;
  }
};
export { padDataArrayWithZero, findMinMax, mergeAndSumArrays, calculateGrowthRateWithIcon };
