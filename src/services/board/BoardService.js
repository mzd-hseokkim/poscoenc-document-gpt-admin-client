import api from '../../api/Api';

const getPostDetail = async (postId) => {
  const response = await api.get(`/admin/boards/${postId}`);
  return response.data;
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
//REMIND Implements post new
const postNew = async (newPost) => {
  const response = await api.post('/admin/boards/', newPost);
  return response.data;
};
const putModifiedPostDetail = async (payload) => {
  const result = await api.put(`/admin/boards/${payload.id}`, payload);
  return result.status === 200;
};

const patchPostsDeletionOption = async (boardIds, deletionOption) => {
  const response = await api.patch(`/admin/boards/deleted/${deletionOption}`, boardIds);
  return response.status === 200;
};

const BoardService = {
  getPostDetail,
  getSearchedPostList,
  postNew,
  putModifiedPostDetail,
  patchPostsDeletionOption,
};

export default BoardService;
