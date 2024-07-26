import api from 'api/Api';
import store from 'store';
import { getCurrentDate } from 'utils/common/dateUtils';

const checkServerStatus = () => {
  const state = store.getState();
  return state.serverStatus.isServerDown;
};

const getDocumentCollectionStatistics = async (startDate, endDate) => {
  if (!checkServerStatus()) {
    return [];
  }
  const response = await api.get('admin/dashboard-statistics/document-collections', {
    params: {
      startDate,
      endDate,
    },
  });
  return response?.data || [];
};

const getPeriodDocumentCollectionStatistics = async (startDate, endDate) => {
  if (!checkServerStatus()) {
    return [];
  }
  const response = await api.get('admin/dashboard-statistics/document-collections/periods', {
    params: {
      baseDate: getCurrentDate(),
    },
  });
  return response?.data || [];
};

const getStandardContractDocumentStatistics = async (startDate, endDate) => {
  if (!checkServerStatus()) {
    return [];
  }
  const response = await api.get('admin/dashboard-statistics/standard-documents', {
    params: {
      startDate,
      endDate,
    },
  });
  return response?.data || [];
};

const getUserAccountStatistics = async () => {
  if (!checkServerStatus()) {
    return [];
  }
  const response = await api.get('admin/dashboard-statistics/user-accounts');
  return response?.data || [];
};

const getChatHistoryStatistics = async (startDate, endDate) => {
  if (!checkServerStatus()) {
    return [];
  }
  const response = await api.get('admin/dashboard-statistics/chats', {
    params: {
      startDate,
      endDate,
    },
  });
  return response?.data || [];
};

const getTokenUsageStatistics = async (startDate, endDate) => {
  if (!checkServerStatus()) {
    return [];
  }
  const response = await api.get('admin/dashboard-statistics/token-usages', {
    params: {
      startDate,
      endDate,
    },
  });
  return response?.data || [];
};

const DashBoardService = {
  getDocumentCollectionStatistics,
  getPeriodDocumentCollectionStatistics,
  getStandardContractDocumentStatistics,
  getUserAccountStatistics,
  getChatHistoryStatistics,
  getTokenUsageStatistics,
};
export default DashBoardService;
