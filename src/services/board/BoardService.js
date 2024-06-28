import api from 'api/Api';
import { formatToYMD, getCurrentDate } from 'utils/common/dateUtils';

const getPostDetail = async (postId) => {
  if (!postId) {
    return;
  }
  const response = await api.get(`/admin/boards/${postId}`);
  return response?.data;
};

const getSearchedPostList = async (params, pageable) => {
  const response = await api.get('/admin/boards', {
    params: {
      title: params.title,
      content: params.content,
      createdByName: params.createdByName,
      hasFilesOption: params.hasFilesOption,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      fromModifiedAt: params.fromModifiedAt,
      toModifiedAt: params.toModifiedAt,
      deletionOption: params.deletionOption,
      page: pageable.page,
      size: pageable.size,
      sort: pageable.sort,
    },
  });
  return response?.data;
};
const getDownloadSearchedPostList = async (params) => {
  const response = await api.get('/admin/boards/excel', {
    params: {
      title: params.title,
      content: params.content,
      createdByName: params.createdByName,
      hasFilesOption: params.hasFilesOption,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      fromModifiedAt: params.fromModifiedAt,
      toModifiedAt: params.toModifiedAt,
      deletionOption: params.deletionOption,
    },
    responseType: 'blob',
  });

  let fileName = `board-post-list_${formatToYMD(getCurrentDate())}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
const patchPostsDeletionOption = async (boardIds, deletionOption) => {
  const response = await api.patch(`/admin/boards/deleted/${deletionOption}`, boardIds);
  return response?.status === 200;
};

const postNew = async (newPost) => {
  const response = await api.post('/admin/boards', newPost);
  return response?.data;
};

const putModifiedPostDetail = async (modifiedPost) => {
  const result = await api.put(`/admin/boards/${modifiedPost.id}`, modifiedPost);
  return result?.status === 200;
};
const BoardService = {
  getPostDetail,
  getSearchedPostList,
  getDownloadSearchedPostList,
  patchPostsDeletionOption,
  postNew,
  putModifiedPostDetail,
};

export default BoardService;
