import api from 'api/Api';

const getMonthlyStatisticsData = async (params) => {
  const response = await api.get('/admin/statistics/month', {
    criteria: params.criteria,
    criteriaKey: params.criteriaKey,
    endData: params.endData,
  });
  return response.data;
};
const StatisticsService = {
  getMonthlyStatisticsData,
};

export default StatisticsService;
