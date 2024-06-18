export const sortByAggregationKey = (chartData) => {
  return chartData.sort((a, b) => {
    const [yearA, monthA] = a.aggregationKey.split('-').map(Number);
    const [yearB, monthB] = b.aggregationKey.split('-').map(Number);

    if (yearA !== yearB) {
      return yearA - yearB;
    } else {
      return monthA - monthB;
    }
  });
};
