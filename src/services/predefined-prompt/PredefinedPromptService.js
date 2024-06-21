import api from 'api/Api';
import { formatToYMD, getCurrentDate } from 'utils/common/dateUtils';

const getPredefinedPromptList = async (params, pageable) => {
  const response = await api.get('/admin/predefined-prompts', {
    params: {
      name: params.name,
      description: params.description,
      content: params.content,
      category: params.category,
      approved: params.approved,
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

const getPredefinedPromptDetail = async (predefinedPromptId) => {
  const response = await api.get(`/admin/predefined-prompts/${predefinedPromptId}`);
  return response?.data;
};
const patchPredefinedPromptDeletionOption = async (predefinedPromptIds, deletionOption) => {
  const response = await api.patch(`/admin/predefined-prompts/deleted/${deletionOption}`, predefinedPromptIds);
  return response.status === 200;
};

const putModifiedPredefinedPromptDetail = async (modifiedPrompt) => {
  const response = await api.put(`/admin/predefined-prompts/${modifiedPrompt.id}`, modifiedPrompt);
  return response.status === 200;
};

const postPredefinedPrompt = async (newPrompt) => {
  const response = await api.post(`/admin/predefined-prompts`, newPrompt);
  return response.data;
};
const getDownloadSearchedPredefinedPromptList = async (params) => {
  const response = await api.get('/admin/predefined-prompts/excel', {
    params: {
      name: params.name,
      description: params.description,
      content: params.content,
      category: params.category,
      approved: params.approved,
      createdByName: params.createdByName,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      deletionOption: params.deletionOption,
    },
    responseType: 'blob',
  });
  let fileName = `predefined-prompt-list_${formatToYMD(getCurrentDate())}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

const PredefinedPromptService = {
  getPredefinedPromptList,
  getPredefinedPromptDetail,
  patchPredefinedPromptDeletionOption,
  getDownloadSearchedPredefinedPromptList,
  putModifiedPredefinedPromptDetail,
  postPredefinedPrompt,
};

export default PredefinedPromptService;
