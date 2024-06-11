import api from 'api/Api';
import { formatToYMD, getCurrentDate } from 'utils/common/dateUtils';

const getStandardContractDocumentList = async (params, pageable) => {
  const response = await api.get('/admin/standard-contract-document', {
    params: {
      originalFilename: params.originalFilename,
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

const getStandardContractDocumentDetail = async (contractId) => {
  if (!contractId) {
    return;
  }
  const response = await api.get(`/admin/standard-contract-document/${contractId}`);
  return response?.data;
};

const patchStandardContractDocumentDeletionOption = async (standardContractDocumentIds, deletionOption) => {
  const response = await api.patch(
    `/admin/standard-contract-document/deleted/${deletionOption}`,
    standardContractDocumentIds
  );
  return response.status === 200;
};

const getDownloadSearchedStandardContractDocumentList = async (params) => {
  const response = await api.get('/admin/standard-contract-document/excel', {
    params: {
      originalFilename: params.originalFilename,
      displayName: params.displayName,
      createdByName: params.createdByName,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      deletionOption: params.deletionOption,
    },
    responseType: 'blob',
  });
  let fileName = `standard-contract-document-list_${formatToYMD(getCurrentDate())}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

const putModifiedDocumentDetail = async (modifiedDocument) => {
  const response = await api.put(`/admin/standard-contract-document/${modifiedDocument.id}`, modifiedDocument);
  return (response.status = 200);
};

const getDownloadContractDocument = async (standardContractDocument) => {
  const response = await api.get(`/admin/standard-contract-document/download/${standardContractDocument.id}`, {
    responseType: 'blob',
  });

  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', standardContractDocument.originalFilename);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

const StandardContractService = {
  getStandardContractDocumentList,
  patchStandardContractDocumentDeletionOption,
  getDownloadSearchedStandardContractDocumentList,
  getStandardContractDocumentDetail,
  putModifiedDocumentDetail,
  getDownloadContractDocument,
};

export default StandardContractService;
