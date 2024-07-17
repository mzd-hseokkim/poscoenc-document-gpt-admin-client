export const weeklyLabel = ['월', '화', '수', '목', '금', '토', '일'];
export const monthlyLabel = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export const getLastSixMonthsLabel = () => {
  const currentMonth = new Date().getMonth();
  const lastSixMonthsLabel = [];

  for (let i = 0; i < 6; i += 1) {
    const monthIndex = (currentMonth - i + 12) % 12;
    lastSixMonthsLabel.unshift(monthlyLabel[monthIndex]);
  }
  return lastSixMonthsLabel;
};

export const getUpdatedWeeklyLabel = () => {
  const currentDay = new Date().getDay();
  const updatedLabel = [];

  for (let i = 0; i < 7; i += 1) {
    const dayIndex = (currentDay + i) % 7;
    updatedLabel.push(weeklyLabel[dayIndex]);
  }

  return updatedLabel;
};
