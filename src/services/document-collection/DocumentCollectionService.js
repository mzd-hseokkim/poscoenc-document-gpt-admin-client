import api from 'api/Api';
import { formatToYMD, getCurrentDate } from 'utils/common/dateUtils';

const getSearchedCollectionList = async (params, pageable) => {
  const response = await api.get('/admin/document-collections', {
    params: {
      name: params.name,
      displayName: params.displayName,
      createdByName: params.createdByName,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      deletionOption: params.deletionOption,
      page: pageable.page,
      size: pageable.size,
      sort: pageable.sort,
    },
  });
  return response?.data ?? [];
};

const getCollectionDetail = async (documentCollectionId) => {
  const response = await api.get(`/admin/document-collections/${documentCollectionId}`);
  return response.data;
};

const getDownloadSearchedCollectionList = async (params) => {
  const response = await api.get('/admin/document-collections/excel', {
    params: {
      name: params.name,
      displayName: params.displayName,
      createdByName: params.createdByName,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      deletionOption: params.deletionOption,
    },
    responseType: 'blob',
  });
  let fileName = `document-collection-list_${formatToYMD(getCurrentDate())}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
const patchCollectionsDeletionOption = async (collectionIds, deletionOption) => {
  const response = await api.patch(`/admin/document-collections/deleted/${deletionOption}`, collectionIds);
  return response.status === 200;
};

const postNewCollection = async (newCollectionFormData) => {
  const response = await api.post('/admin/document-collections', newCollectionFormData);
  return response.status === 200;
};

const putModifiedCollectionDetail = async (modifiedCollection) => {
  const response = await api.put(`/admin/document-collections/${modifiedCollection.id}`, modifiedCollection);
  return response.status === 200;
};

const DocumentCollectionService = {
  getSearchedCollectionList,
  getCollectionDetail,
  getDownloadSearchedCollectionList,
  patchCollectionsDeletionOption,
  postNewCollection,
  putModifiedCollectionDetail,
};
export default DocumentCollectionService;
