import api from 'api/Api';

const getMonthlyStatisticsData = async (params) => {
  const response = await api.get('/admin/token-statistics/month', {
    params: {
      criteria: params.criteria,
      criteriaKey: params.criteriaKey,
      endDate: params.endDate,
    },
  });
  return response?.data;
};
const getUserUsageStatistics = async (yyyyMM, pageable) => {
  const response = await api.get('/admin/token-statistics/created-by', {
    params: {
      month: yyyyMM,
      page: pageable.page,
      size: pageable.size,
      sort: pageable.sort,
    },
  });

  return response?.data;
};

const getDocumentCollectionUsageStatistics = async (yyyyMM, pageable) => {
  const response = await api.get('/admin/token-statistics/document-collection', {
    params: { month: yyyyMM, page: pageable.page, size: pageable.size, sort: pageable.sort },
  });
  return response?.data;
};

const StatisticsService = {
  getMonthlyStatisticsData,
  getUserUsageStatistics,
  getDocumentCollectionUsageStatistics,
};

export default StatisticsService;
