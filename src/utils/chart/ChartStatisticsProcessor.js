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
    const index =
      (((yearDiff * 12 + month - currentMonth + totalMonths) % totalMonths) + (totalMonths - 1)) % totalMonths;

    result[index] = item;
  });

  // Fill remaining zeroObject entries with appropriate aggregationKey
  return result.map((item, idx) => {
    if (item[aggregationKeyName] === '') {
      // Calculate the correct month and year for the missing entries
      let month = (currentMonth - totalMonths + idx + 1) % 12;
      if (month <= 0) {
        month += 12;
      }
      let year = currentYear;
      if (month > currentMonth) {
        year -= 1;
      }
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

const calculateMonthOnMonthGrowthRateWithArrow = (prevMonthValue, currentMonthValue) => {
  if (prevMonthValue === 0) {
    return currentMonthValue ? `${100}% ↑` : '-%';
  } else {
    const growthRate = ((currentMonthValue - prevMonthValue) / prevMonthValue) * 100;
    const formattedGrowthRate = `${growthRate.toFixed(1)}%`;

    let arrow = '';

    if (growthRate > 0) {
      arrow = ' ↑';
    } else if (growthRate < 0) {
      arrow = ' ↓';
    } else {
      arrow = ' -';
    }

    return formattedGrowthRate + arrow;
  }
};

//REMIND 삭제된 문서의 경우는 어떻게 처리 할지에 대한 결정이 필요
const calculateAccumulatedGrowthRate = (totalValue, incremental) => {
  if (incremental === 0) {
    return incremental ? `${0}% -` : '-%';
  } else {
    const growthRate = ((incremental / totalValue) * 100).toFixed(1);
    let arrow = '';

    if (growthRate > 0) {
      arrow = ' ↑';
    } else if (growthRate < 0) {
      arrow = ' ↓';
    } else {
      arrow = ' -';
    }
    return `${growthRate}%${arrow}`;
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
 * 최대, 최솟값이 0일 경우 차트 에러를 방지하기 위해 최소 0 , 최대 10 값이 설정됩니다.
 */
const findPaddedMaxMin = (numbers) => {
  const { max, min } = findMinMax(numbers);
  const padding = (max - min) * 0.1;
  const paddedMin = min - padding;
  const paddedMax = max + padding;

  return { paddedMax, paddedMin };
};
export {
  padDataArrayWithZero,
  mergeAndSumArrays,
  calculateMonthOnMonthGrowthRateWithArrow,
  findMinMax,
  findPaddedMaxMin,
  calculateAccumulatedGrowthRate,
};

export const tokenStatisticsPaddingObject = {
  aggregationCount: 0,
  aggregationKey: '',
  aggregationName: null, //사용 통계 관리 페이지에서 사용
  sumBingSearchs: 0,
  sumDallE3Generations: 0,
  sumInputTokens: 0,
  sumOutputTokens: 0,
};
