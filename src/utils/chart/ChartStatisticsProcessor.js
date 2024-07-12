const padDataArrayWithZero = (data, currentMonth, totalMonths, aggregationKeyName, zeroObject) => {
  if (data.length > totalMonths) {
    console.error('The length of data cannot exceed the total number of months.');
    return null;
  }

  // Initialize an array of the desired length filled with the provided zeroObject
  const result = new Array(totalMonths).fill(null).map(() => ({ ...zeroObject }));

  // Get the current year
  const currentYear = new Date().getFullYear();

  // First, place the data into the result array
  data.forEach((item) => {
    const [year, month] = item[aggregationKeyName].split('-').map(Number);
    const yearDiff = year - currentYear;
    const index = (yearDiff * 12 + month - currentMonth + totalMonths) % totalMonths;
    result[index] = item;
  });

  // Fill remaining zeroObject entries with appropriate aggregationKey
  return result.map((item, idx) => {
    if (item[aggregationKeyName] === '') {
      const month = ((currentMonth + idx - 1) % 12) + 1;
      const year = currentYear + Math.floor((currentMonth + idx - 1) / 12);
      return { ...zeroObject, [aggregationKeyName]: `${year}-${String(month).padStart(2, '0')}` };
    }
    return item;
  });
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
    return currentMonthValue ? `${100}% ↑` : '-%';
  } else {
    const growthRate = ((currentMonthValue - prevMonthValue) / prevMonthValue) * 100;
    const formattedGrowthRate = `${growthRate.toFixed(1)}%`;

    let icon = '';

    if (growthRate > 0) {
      icon = ' ↑';
    } else if (growthRate < 0) {
      icon = ' ↓';
    } else {
      icon = ' -';
    }

    return formattedGrowthRate + icon;
  }
};

const findMinMax = (numbers) => {
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);

  return { max, min };
};

/**
 *
 * @param numbers Chart Data 를 받습니다.
 * @returns {{paddedMax: number, paddedMin: number}} 받은 Data 의 최대, 최소값에 패딩한 값을 반환합니다.
 *
 * @description
 * 최대 최소값 차이의 10% 를 최소값에서 빼고, 최대값에서 더한 값을 반환합니다.
 * CWidgetState 컴포넌트 종류의 차트가 잘려서 렌더링 되는 것을 방지하기 위해 사용됩니다.
 */
const findPaddedMaxMin = (numbers) => {
  const { max, min } = findMinMax(numbers);
  const padding = (max - min) * 0.1;
  const paddedMin = min - padding;
  const paddedMax = max + padding;

  return { paddedMax, paddedMin };
};
export { padDataArrayWithZero, mergeAndSumArrays, calculateGrowthRateWithIcon, findMinMax, findPaddedMaxMin };

export const tokenStatisticsPaddingObject = {
  aggregationCount: 0,
  aggregationKey: '',
  aggregationName: null,
  sumBingSearchs: 0,
  sumDallE3Generations: 0,
  sumInputTokens: 0,
  sumOutputTokens: 0,
};
