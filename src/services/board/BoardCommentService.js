import api from '../../api/Api';

const getPostComments = async (postId) => {
  const response = await api.get('/admin/board-comments', {
    params: {
      boardId: postId,
      size: 100,
    },
  });
  return response.data.content;
};
const postCommentApi = async (postId, content) => {
  const response = await api.post('/admin/board-comments', {
    //REMIND postId 로 변경 요청
    boardId: postId,
    content,
  });
  return response.data;
};

const patchDeleteCommentApi = async (commentId, deletionOption) => {
  const response = await api.patch(`/admin/board-comments/deleted/${deletionOption}`, [commentId]);
  return response.data;
};
export { getPostComments, postCommentApi, patchDeleteCommentApi };
