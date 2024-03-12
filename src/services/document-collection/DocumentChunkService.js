import api from 'api/Api';

const getSearchedDocumentChunk = async (params, pageable) => {
  const response = await api.get('/admin/document-collections-chunk', {
    params: {
      chunkedText: params.chunkedText,
      chunkSeq: params.chunkSeq,
      documentCollectionId: params.documentCollectionId,
      documentCollectionFileId: params.documentCollectionFileId,
      documentCollectionFileNameOrg: params.documentCollectionFileNameOrg,
      pageId: params.pageId,
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

const getDocumentChunk = async (id) => {
  const response = await api.get(`/admin/document-collections-chunk/${id}`);
  return response?.data;
};
const DocumentChunkService = {
  getSearchedDocumentChunk,
  getDocumentChunk,
};
export default DocumentChunkService;
