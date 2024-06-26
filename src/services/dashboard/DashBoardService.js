import api from 'api/Api';

const getDocumentCollectionStatistics = async (startDate, endDate) => {
  const response = await api.get(
    `admin/dashboard-statistics/document-collections?startDate=${startDate}&endDate=${endDate}`
  );
  return response?.data;
};
const getStandardContractDocumentStatistics = async (startDate, endDate) => {
  const response = await api.get(
    `admin/dashboard-statistics/standard-documents?startDate=${startDate}&endDate=${endDate}`
  );
  return response?.data;
};
const getUserAccountStatistics = async () => {
  const response = await api.get('admin/dashboard-statistics/user-accounts');
  console.log(response);
  return response?.data;
};
const getChatHistoryStatistics = async (startDate, endDate) => {
  const response = await api.get(`/api/v1/admin/dashboard-statistics/chats?startDate=${startDate}&endDate=${endDate}`);
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
