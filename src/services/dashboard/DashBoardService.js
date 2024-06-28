import api from 'api/Api';

const getDocumentCollectionStatistics = async (startDate, endDate) => {
  const response = await api.get('admin/dashboard-statistics/document-collections', {
    params: {
      startDate,
      endDate,
    },
  });
  return response?.data;
};

const getStandardContractDocumentStatistics = async (startDate, endDate) => {
  const response = await api.get('admin/dashboard-statistics/standard-documents', {
    params: {
      startDate,
      endDate,
    },
  });
  return response?.data;
};

const getUserAccountStatistics = async () => {
  const response = await api.get('admin/dashboard-statistics/user-accounts');
  return response?.data;
};

const getChatHistoryStatistics = async (startDate, endDate) => {
  const response = await api.get('admin/dashboard-statistics/chats', {
    params: {
      startDate,
      endDate,
    },
  });
  console.log(response);
  return response?.data;
};

const DashBoardService = {
  getDocumentCollectionStatistics,
  getStandardContractDocumentStatistics,
  getUserAccountStatistics,
  getChatHistoryStatistics,
};
export default DashBoardService;
