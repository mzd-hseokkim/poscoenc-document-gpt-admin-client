import api from 'api/Api';

const getSearchedDocumentChatHistory = async (params, pageable) => {
  const response = await api.get('/admin/document-collections-chat-history', {
    params: {
      question: params.question,
      answer: params.answer,
      documentCollectionId: params.documentCollectionId,
      documentCollectionChunkId: params.documentCollectionChunkId,
      documentCollectionDisplayName: params.documentCollectionDisplayName,
      documentCollectionName: params.documentCollectionName,
      chunkedText: params.chunkedText,
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
  const response = await api.get(`/api/v1/admin/document-collections-chat-history/${id}`);
  return response?.data;
};

const DocumentChatHistoryService = {
  getSearchedDocumentChatHistory,
  getDocumentChatHistory,
};
export default DocumentChatHistoryService;
