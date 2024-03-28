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

export { padDataArrayWithZero, findMinMax };
