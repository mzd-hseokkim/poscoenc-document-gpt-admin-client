import api from '../../api/Api';

const getPostDetails = async (postId) => {
  const response = await api.get(`/admin/boards/${postId}`);
  return response.data;
};

const getSearchedPostList = async (params) => {
  const response = await api.get('/admin/boards', {
    params: {
      title: params.title,
      content: params.content,
      createdByName: params.createdByName,
      hasFilesOption: params.hasFilesOption,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      deletionOption: params.deletionOption,
      page: params.page,
      size: params.size,
    },
  });
  return response?.data.content ?? [];
};

const putModifiedPostDetails = async (payload) => {
  const response = await api.put(`/admin/boards/${payload.id}`, payload);
  return response.data;
};

const patchPostsDeletedOption = async (boardIds, deletedOption) => {
  const response = await api.patch(`/admin/boards/deleted/${deletedOption}`, boardIds);
  return response.status === 200;
};

const BoardService = {
  getPostDetails,
  getSearchedPostList,
  putModifiedPostDetails,
  patchPostsDeletedOption,
};

export default BoardService;
