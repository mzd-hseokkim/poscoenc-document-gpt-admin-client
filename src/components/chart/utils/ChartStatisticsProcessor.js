const padDataArrayWithZero = (data) => {
  return data.length < 12 ? new Array(12 - data.length).fill(0).concat(data) : data;
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
    return `${100}% ↑`;
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
