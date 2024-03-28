import api from 'api/Api';

const getMonthlyStatisticsData = async (params) => {
  const response = await api.get('/admin/statistics/month', {
    params: {
      criteria: params.criteria,
      criteriaKey: params.criteriaKey,
      endDate: params.endDate,
    },
  });
  return response.data;
};
const StatisticsService = {
  getMonthlyStatisticsData,
};

export default StatisticsService;
