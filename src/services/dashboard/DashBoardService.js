import api from 'api/Api';

const getDocumentCollectionStatistics = async () => {
  const response = await api.get('admin/dashboard-statistics/document-collections');
  console.log(response);
  return response?.data;
};
const getStandardContractDocumentStatistics = async () => {
  const response = await api.get('admin/dashboard-statistics/standard-documents');
  console.log(response);
  return response?.data;
};
const getUserAccountStatistics = async () => {
  const response = await api.get('admin/dashboard-statistics/user-accounts');
  console.log(response);
  return response?.data;
};
const getChatHistoryStatistics = async () => {
  const response = await api.get('admin/dashboard-statistics/chats');
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
