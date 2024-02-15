import api from '../../api/Api';

const getPostDetailsApi = async (postId) => {
  //REMIND 조회시랑 새로고침 할 때 조회수 올라가지 않도록 분리
  await api.patch(`/admin/boards/${postId}/view`);
  const response = await api.get(`/admin/boards/${postId}`);
  return response.data;
};

const getSearchedPostListApi = async (params) => {
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

const putModifiedPostDetailsApi = async (payload) => {
  const response = await api.put(`/admin/boards/${payload.id}`, payload);
  return response.data;
};

const patchPostsDeletedOptionApi = async (boardIds, deletedOption) => {
  const response = await api.patch(`/admin/boards/deleted/${deletedOption}`, boardIds);
  return response.status === 200;
};
export { getPostDetailsApi, getSearchedPostListApi, putModifiedPostDetailsApi, patchPostsDeletedOptionApi };
