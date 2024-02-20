import { useEffect, useRef, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormTextarea,
  CInputGroup,
  CRow,
} from '@coreui/react-pro';
import { useRecoilValue } from 'recoil';

import { useToast } from '../../context/ToastContext';
import BoardCommentService from '../../services/board/BoardCommentService';
import { userIdSelector } from '../../states/jwtTokenState';

const BoardCommentsForm = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState([]);
  const [showDeletedComments, setShowDeletedComments] = useState(true);

  //REMIND imple loading spinner
  const [getIsLoading, setGetIsLoading] = useState(true);
  const [postCommentIsLoading, setPostCommentIsLoading] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  const { addToast } = useToast();
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
    if (!postCommentIsLoading) {
      endOfCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } // REMIND 현재는 본인이 답글 달 때만 아래로 스크롤, 추후 새로운 댓글이 달렸을 때 아래로 스크롤 하는걸 고려
  }, [postCommentIsLoading]);

  const renderCommentList = () => (
    <CRow>
      {postComments?.map((comment, index) => renderCommentItem(comment, index))}
      <div ref={endOfCommentsRef} />
    </CRow>
  );

  const renderCommentItem = (comment, key) => {
    if (!showDeletedComments && comment.deleted) {
      return null;
    }

    return (
      <CCol xs={12} key={key}>
        <CCard
          className={`comment-item mt-2 ${comment.deleted ? 'deleted-comment' : ''}`}
          style={{ marginBottom: '1rem' }}
        >
          <CCardHeader>{renderCommentAuthorAndActions(comment)}</CCardHeader>
          <CCardBody>{renderCommentContent(comment)}</CCardBody>
        </CCard>
      </CCol>
    );
  };

  const renderCommentContent = (comment) => (
    <CRow>
      <CCol>
        <p style={{ textDecoration: comment.deleted ? 'line-through' : 'none' }}>{comment.content}</p>
      </CCol>
    </CRow>
  );

  const renderCommentAuthorAndActions = (comment) => (
    <CRow>
      <CCol className="d-flex justify-content-between">
        <strong>{comment.createdByName}</strong>
        {comment.createdByName === currentUserId && (
          <CButton color="primary" size="sm" onClick={() => toggleCommentStatus(comment.id, !comment.deleted)}>
            {comment.deleted ? '복구' : '삭제'}
          </CButton>
        )}
      </CCol>
    </CRow>
  );

  const renderCommentInput = () => (
    <CInputGroup className="mb-3">
      <CFormTextarea rows={2} placeholder="댓글을 입력해주세요." value={commentText} onChange={handleCommentChange} />
      <CButton type="submit" color="primary" disabled={!commentText.trim()}>
        작성
      </CButton>
    </CInputGroup>
  );

  return (
    <CForm onSubmit={handleCommentSubmit} className="comments-section">
      <CCard className="mt-3 mb-3">
        <CCardHeader className="d-flex justify-content-between">
          댓글
          <CFormCheck
            id="showDeletedComments"
            label="삭제된 댓글 표시"
            checked={showDeletedComments}
            onChange={(e) => setShowDeletedComments(e.target.checked)}
          />
        </CCardHeader>
        <CCardBody style={{ height: '180px', overflowY: 'auto' }}>{renderCommentList()}</CCardBody>
      </CCard>
      {renderCommentInput()}
    </CForm>
  );
};
export default BoardCommentsForm;
