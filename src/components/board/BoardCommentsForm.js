import { useEffect, useRef, useState } from 'react';

import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react-pro';
import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';

import { useBoardPostComments } from '../../hooks/board/comment/useBoardPostComments';
import useDeleteComment from '../../hooks/board/comment/useDeleteComment';
import useSubmitComment from '../../hooks/board/comment/useSubmitComment';
import { userIdSelector } from '../../states/jwtTokenState';

const BoardCommentsForm = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const boardPostComments = useBoardPostComments(postId);
  const submitComment = useSubmitComment();
  const { deleteComment } = useDeleteComment();
  const currentUserId = useRecoilValue(userIdSelector);
  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await submitComment.submitComment(postId, commentText);
    setCommentText('');
    await boardPostComments.fetchPostComments();
  };

  const toggleCommentStatus = async (commentId, shouldDelete) => {
    try {
      const isSuccess = await deleteComment(commentId, shouldDelete);
      if (isSuccess) {
        await boardPostComments.fetchPostComments();
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  // scroll ------------------------------------------------------------
  const endOfCommentsRef = useRef(null);

  useEffect(() => {
    endOfCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [boardPostComments.postComments]);
  // scroll ------------------------------------------------------------

  return (
    <CForm onSubmit={handleCommentSubmit} className="comments-section">
      <CFormLabel htmlFor="postComments">댓글</CFormLabel>
      <div style={{ height: '180px', overflowY: 'auto' }}>
        {boardPostComments.postComments?.map((comment, index) => (
          <div key={index} className={`comment-item mb-2 ${comment.deleted ? 'deleted' : ''}`}>
            <CInputGroup className="mb-1">
              <CFormText readOnly>{`작성자 : ${comment.createdByName}`}</CFormText>
              {/*REMIND 댓글 작성자 id 를 받아오게 수정 요청*/}
              {comment.createdByName === currentUserId && (
                <div className="ms-auto">
                  <CButton
                    size="sm"
                    className="me-2"
                    //StartFrom onClick={() => handleEdit(comment)}
                  >
                    수정
                  </CButton>
                  <CButton
                    size="sm"
                    className="text-danger"
                    onClick={() => toggleCommentStatus(comment.id, !comment.deleted)}
                  >
                    {comment.deleted ? '복구' : '삭제'}
                  </CButton>
                </div>
              )}
              <CFormText className="ms-2">
                {`작성일시 : ${format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm:ss')}`}
              </CFormText>
            </CInputGroup>
            {comment.createdByName === currentUserId ? (
              <CFormInput
                className="mb-1 p-2"
                disabled={comment.deleted}
                defaultValue={comment.content}
                // readOnly={!isEditing || editingCommentId !== comment.id}
              />
            ) : (
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
            )}
          </div>
        ))}

        <div ref={endOfCommentsRef} />
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
