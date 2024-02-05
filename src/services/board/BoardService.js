import api from '../../api/Api';

const getBoardList = async () => {
  const response = await api.get('/admin/boards');
  return response.data.content;
};

const getPostDetails = async (postId) => {
  const response = await api.get(`/admin/boards/${postId}`);
  return response.data;
};

const fetchPostsDeletedOption = async (boardIds, deletedOption) => {
  const response = await api.patch(`/admin/boards/deleted/${deletedOption}`, boardIds);
  return response.status === 200;
};

export { getBoardList, getPostDetails, fetchPostsDeletedOption };
