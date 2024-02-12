import api from '../../api/Api';

const getPostList = async () => {
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

//StartFrom 수정 api 추가하면서, form readonly 설정 조절, 코멘트 readonly 설정 조절
const modifyPostDetails = async (postId) => {
  const response = await api.put(`/admin/boards/${postId}`);
  // REMIND now id, request modified data.
  return response.data;
};
export { getPostList, getPostDetails, fetchPostsDeletedOption };
