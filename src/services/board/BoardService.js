import api from '../../api/Api';

const getPostList = async () => {
  const response = await api.get('/admin/boards');
  return response.data.content;
};

const getPostDetails = async (postId) => {
  const response = await api.get(`/admin/boards/${postId}`);
  return response.data;
};

const searchPostList = async (params) => {
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

const fetchPostsDeletedOption = async (boardIds, deletedOption) => {
  const response = await api.patch(`/admin/boards/deleted/${deletedOption}`, boardIds);
  return response.status === 200;
};

const modifyPostDetails = async (payload) => {
  const response = await api.put(`/admin/boards/${payload.id}`, payload);
  // REMIND now id, request modified data.
  return response.data;
};
export { getPostList, getPostDetails, searchPostList, modifyPostDetails, fetchPostsDeletedOption };
