import { useEffect, useRef, useState } from 'react';

import { CButton, CForm, CFormLabel, CFormText, CFormTextarea, CInputGroup, CInputGroupText } from '@coreui/react-pro';
import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';

import useToast from '../../hooks/useToast';
import BoardCommentService from '../../services/board/BoardCommentService';
import { userIdSelector } from '../../states/jwtTokenState';

const BoardCommentsForm = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState([]);
  //REMIND imple loading spinner
  const [getIsLoading, setGetIsLoading] = useState(true);
  const [postCommentIsLoading, setPostCommentIsLoading] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  const addToast = useToast();
  const currentUserId = useRecoilValue(userIdSelector);
  const endOfCommentsRef = useRef(null);

  const fetchPostComments = async () => {
    setGetIsLoading(true);
    try {
      const comments = await BoardCommentService.getPostComments(postId);
      setPostComments(comments);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setGetIsLoading(false);
    }
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setPostCommentIsLoading(true);
    try {
      await BoardCommentService.postComment(postId, commentText);
      setCommentText('');
      await fetchPostComments();
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setPostCommentIsLoading(false);
    }
  };

  const toggleCommentStatus = async (commentId, shouldDelete) => {
    setDeleteIsLoading(true);
    try {
      await BoardCommentService.patchDeletionOptionComment(commentId, shouldDelete);
      await fetchPostComments();
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setDeleteIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  useEffect(() => {
    endOfCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [postComments]);

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
