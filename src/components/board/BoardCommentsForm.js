import { useEffect, useRef, useState } from 'react';

import { CButton, CForm, CFormLabel, CFormText, CFormTextarea, CInputGroup, CInputGroupText } from '@coreui/react-pro';
import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';

import useDeleteComment from '../../hooks/board/comment/useDeleteComment';
import { usePostComments } from '../../hooks/board/comment/usePostComments';
import useSubmitComment from '../../hooks/board/comment/useSubmitComment';
import { userIdSelector } from '../../states/jwtTokenState';

const BoardCommentsForm = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const { postComments, isLoading, fetchPostComments } = usePostComments(postId);
  const submitComment = useSubmitComment();
  //REMIND add loading state
  const { deleteComment, deleteIsLoading } = useDeleteComment();
  const currentUserId = useRecoilValue(userIdSelector);

  // create, delete  -------------------------------------------------------------
  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await submitComment.submitComment(postId, commentText);
    setCommentText('');
    await fetchPostComments();
  };

  const toggleCommentStatus = async (commentId, shouldDelete) => {
    await deleteComment(commentId, shouldDelete);
    await fetchPostComments();
  };
  // create, delete --------------------------------------------------------------

  // scroll ------------------------------------------------------------
  const endOfCommentsRef = useRef(null);

  useEffect(() => {
    endOfCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [postComments]);

  // scroll ------------------------------------------------------------

  return (
    <CForm onSubmit={handleCommentSubmit} className="comments-section">
      <CFormLabel htmlFor="postComments">댓글</CFormLabel>

      <div style={{ height: '180px', overflowY: 'auto' }}>
        {postComments?.map((comment, index) => (
          <div key={index} className={`comment-item mb-2 ${comment.deleted ? 'deleted' : ''}`}>
            <CInputGroup className="mb-1">
              <CFormText readOnly>{`작성자 : ${comment.createdByName}`}</CFormText>
              {/*REMIND comment 와 post 에 createdBy Id 도 반환할수있도록 변경요청*/}
              {comment.createdByName === currentUserId && (
                <div className="ms-auto">
                  <CButton size="sm" onClick={() => toggleCommentStatus(comment.id, !comment.deleted)}>
                    {comment.deleted ? '복구' : '삭제'}
                  </CButton>
                </div>
              )}
              <CFormText className="ms-2">
                {`작성일시 : ${format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm:ss')}`}
              </CFormText>
            </CInputGroup>
            <CFormText
              className="mb-1 p-2"
              style={{
                textDecoration: comment.deleted ? 'line-through' : 'none',
                height: '30px',
                fontSize: 'small-caption',
              }}
              readOnly
            >
              {comment.content}
            </CFormText>
            <div ref={endOfCommentsRef} />
          </div>
        ))}
      </div>

      <CInputGroup className="mb-3 mt-4">
        <CInputGroupText>댓글</CInputGroupText>
        <CFormTextarea placeholder="댓글을 입력해주세요." value={commentText} onChange={handleCommentChange} />
        <CButton disabled={!commentText.trim()} type="submit" style={{ cursor: 'pointer' }}>
          작성
        </CButton>
      </CInputGroup>
    </CForm>
  );
};
export default BoardCommentsForm;
