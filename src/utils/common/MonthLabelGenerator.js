const monthsNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const getPastYearMonths = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const months = [];

  for (let i = 0; i < 12; i += 1) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    months.unshift({ monthIndex, year });
  }

  return months;
};
const pastYearMonthsChartLabels = () => {
  const months = getPastYearMonths();
  return months.map(({ monthIndex, year }, index) => {
    let label = '';

    if (index === 0 || monthIndex === 0) {
      label += `${year}년 / `;
    }

    label += monthsNames[monthIndex];
    return label;
  });
};

const pastYearMonthsSelectBoxLabels = () => {
  const months = getPastYearMonths();
  return months.map(({ monthIndex, year }, index) => {
    let label = monthsNames[monthIndex];

    if (index === 0 || monthIndex === 0) {
      label = `${year}년 ${label}`;
    }

    const value = `${year}${(monthIndex + 1).toString().padStart(2, '0')}`;
    return { value, label };
  });
};

const MonthLabelGenerator = {
  pastYearMonthsSelectBoxLabels,
  pastYearMonthsChartLabels,
};

export default MonthLabelGenerator;
