const padDataArrayWithZero = (data, currentMonth) => {
  const result = new Array(12).fill({
    aggregationCount: 0,
    aggregationKey: '',
    aggregationName: null,
    sumBingSearchs: 0,
    sumDallE3Generations: 0,
    sumInputTokens: 0,
    sumOutputTokens: 0,
  });

  data.forEach((item) => {
    const month = parseInt(item.aggregationKey.split('-')[1], 10);
    const index = (month - currentMonth + 12) % 12;
    result[11 - ((12 - index) % 12)] = item;
  });

  return result;
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
    const formattedGrowthRate = `${growthRate}%`;

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
export { padDataArrayWithZero, mergeAndSumArrays, calculateGrowthRateWithIcon };
