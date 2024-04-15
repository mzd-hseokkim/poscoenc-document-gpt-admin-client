import api from 'api/Api';

const getPostComments = async (postId) => {
  const response = await api.get('/admin/board-comments', {
    //remind pagenum 설정
    params: {
      boardId: postId,
      size: 100,
    },
  });
  return response.data.content;
};
const postComment = async (postId, content) => {
  const response = await api.post('/admin/board-comments', {
    //REMIND postId 로 변경 요청
    boardId: postId,
    content,
  });
  return response.data;
};

const patchDeletionOptionComment = async (commentId, deletionOption) => {
  const response = await api.patch(`/admin/board-comments/deleted/${deletionOption}`, [commentId]);
  return response.data;
};

// REMIND 댓글 수정 대신 생성,삭제
const BoardCommentService = { getPostComments, postComment, patchDeletionOptionComment };
export default BoardCommentService;
