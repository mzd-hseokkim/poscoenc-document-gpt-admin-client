import api from 'api/Api';

const getDownloadDocument = async (file) => {
  const response = await api.get(`/admin/document-collection-files/download/${file.id}`, {
    responseType: 'blob',
  });

  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', file.originalName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

const DocumentCollectionFileService = {
  getDownloadDocument,
};

export default DocumentCollectionFileService;
