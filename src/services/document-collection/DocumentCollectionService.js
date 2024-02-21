import api from '../../api/Api';

const getSearchedCollectionList = async (params) => {
  const response = await api.get('/admin/document-collections', {
    params: {
      name: params.name,
      displayName: params.displayName,
      createdByName: params.createdByName,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      deletionOption: params.deletionOption,
      page: params.page,
      size: params.size,
    },
  });
  return response?.data.content ?? [];
};

const getCollectionDetail = async (documentCollectionId) => {
  const response = await api.get(`/admin/document-collections/${documentCollectionId}`);
  return response.data;
};

const putModifiedCollectionDetail = async (modifiedCollection) => {
  const response = await api.put(`/admin/document-collections/${modifiedCollection.id}`, modifiedCollection);
  return response.status === 200;
};
const postNewCollection = async (newCollectionFormData) => {
  const response = await api.post('/admin/document-collections', newCollectionFormData);
  return response.status === 200;
};

const patchCollectionsDeletionOption = async (collectionIds, deletionOption) => {
  const response = await api.patch(`/admin/document-collections/deleted/${deletionOption}`, collectionIds);
  return response.status === 200;
};

//REMIND implements excel downloads
const getCollectionExcelFile = async (params) => {
  return await api.get('/admin/document-collections', {
    name: params.name,
    displayName: params.displayName,
    createdByName: params.createdByName,
    fromCreatedAt: params.fromCreatedAt,
    toCreatedAt: params.toCreatedAt,
    deletionOption: params.deletionOption,
  });
};

const DocumentCollectionService = {
  getSearchedCollectionList,
  getCollectionDetail,
  putModifiedCollectionDetail,
  postNewCollection,
  patchCollectionsDeletionOption,
  getCollectionExcelFile,
};
export default DocumentCollectionService;
