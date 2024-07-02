import api from 'api/Api';
import { formatToYMD, getCurrentDate } from 'utils/common/dateUtils';

const getSearchedDocumentChatHistory = async (params, pageable) => {
  const response = await api.get('/admin/document-collections-chat-history', {
    params: {
      answer: params.answer,
      question: params.question,
      documentCollectionId: params.documentCollectionId,
      documentCollectionDisplayName: params.documentCollectionDisplayName,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      createdByName: params.createdByName,
      page: pageable.page,
      size: pageable.size,
      sort: pageable.sort,
    },
  });
  return response?.data ?? [];
};

const getDocumentChatHistory = async (id) => {
  if (!id) {
    return;
  }
  const response = await api.get(`/admin/document-collections-chat-history/${id}`);
  return response?.data;
};

const getDownloadSearchedChatHistoryList = async (params) => {
  const response = await api.get('/admin/document-collections-chat-history/excel', {
    params: {
      answer: params.answer,
      question: params.question,
      documentCollectionId: params.documentCollectionId,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      createdByName: params.createdByName,
    },
    responseType: 'blob',
  });
  let fileName = `document-collection-chat-history-list_${formatToYMD(getCurrentDate())}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
const DocumentChatHistoryService = {
  getSearchedDocumentChatHistory,
  getDocumentChatHistory,
  getDownloadSearchedChatHistoryList,
};
export default DocumentChatHistoryService;
