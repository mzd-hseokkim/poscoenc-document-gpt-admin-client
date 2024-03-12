import api from 'api/Api';

const getSearchedDocumentChatHistory = async (params, pageable) => {
  const response = await api.get('/admin/document-collections-chat-history', {
    params: {
      answer: params.answer,
      question: params.question,
      documentCollectionId: params.documentCollectionId,
      documentCollectionName: params.documentCollectionName,
      documentCollectionDisplayName: params.documentCollectionDisplayName,
      documentCollectionChunkId: params.documentCollectionChunkId,
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
