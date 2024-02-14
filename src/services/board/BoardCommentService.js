import api from '../../api/Api';

const getPostComments = async (postId) => {
  const response = await api.get('/admin/board-comments', {
    params: {
      boardId: postId,
      size: 100,
    },
  });
  //TODO pagenation 으로 반환해서 10개까지 밖에 안보임. search 와 get 구분 필요.
  return response.data.content;
};
const writeCommentApi = async (postId, content) => {
  const response = await api.post('/admin/board-comments', {
    //REMIND postId 로 변경 요청
    boardId: postId,
    content,
  });
  return response.data;
};

const modifyCommentApi = async (commentId, comment) => {
  const response = await api.put(`/admin/board-comments/${commentId}`, {
    id: commentId,
    boardId: comment.postId,
    content: comment.content,
  });
  return response.data;
};

const deleteCommentApi = async (commentId, deletionOption) => {
  const response = await api.patch(`/admin/board-comments/deleted/${deletionOption}`, [commentId]);
  return response.data;
};
export { getPostComments, writeCommentApi, modifyCommentApi, deleteCommentApi };
