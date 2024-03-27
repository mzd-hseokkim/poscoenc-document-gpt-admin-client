const monthsNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const chartPastYearMonthsLabels = () => {
  const generateMonths = () => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 월은 0부터 시작
    const currentYear = today.getFullYear();
    const generatedMonths = [];

    for (let i = 0; i < 12; i += 1) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;

      let label = '';
      if (monthIndex === 0) {
        label += `${currentYear} / `;
      } else if (i === 11) {
        label += `${year} / `;
      }

      label += monthsNames[monthIndex];
      generatedMonths.unshift(label);
    }
    return generatedMonths;
  };

  return generateMonths();
};

export default chartPastYearMonthsLabels;
