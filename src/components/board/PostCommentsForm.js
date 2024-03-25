import { useCallback, useEffect, useRef, useState } from 'react';

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
import { useToast } from 'context/ToastContext';
import BoardCommentService from 'services/board/BoardCommentService';

const PostCommentsForm = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState([]);
  const [showDeletedComments, setShowDeletedComments] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [postCommentIsLoading, setPostCommentIsLoading] = useState(false);

  const { addToast } = useToast();
  const endOfCommentsRef = useRef(null);

  const fetchPostComments = useCallback(async () => {
    try {
      const comments = await BoardCommentService.getPostComments(postId);
      setPostComments(comments);
    } catch (error) {
      addToast({ message: '댓글을 불러오지 못했습니다. 관리자에게 문의하세요.' });
    }
  }, [addToast, postId]);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setPostCommentIsLoading(true);
    try {
      await BoardCommentService.postComment(postId, commentText);
      setCommentText('');
      await fetchPostComments();
    } catch (error) {
      if (error.response?.status === 404) {
        addToast({ message: '댓글 저장에 실패했습니다. 게시글이 삭제되었는지 확인 해 주세요.' });
      } else {
        console.log(error);
      }
    } finally {
      setPostCommentIsLoading(false);
    }
  };
  const handleSubmitCommentAsEnter = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isComposing && commentText.trim()) {
        void handleSubmitComment(event);
      }
    }
  };

  const toggleCommentStatus = async (commentId, shouldDelete) => {
    try {
      await BoardCommentService.patchDeletionOptionComment(commentId, shouldDelete);
      await fetchPostComments();
    } catch (error) {
      if (error.response?.status === 404) {
        addToast({ message: '삭제할 댓글을 찾지 못했습니다.' });
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    void fetchPostComments();
  }, [fetchPostComments, postId]);

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
        <CButton color="primary" size="sm" onClick={() => toggleCommentStatus(comment.id, !comment.deleted)}>
          {comment.deleted ? '복구' : '삭제'}
        </CButton>
      </CCol>
    </CRow>
  );

  const renderCommentInput = () => (
    <CInputGroup className="mb-3">
      <CFormTextarea
        rows={2}
        placeholder="댓글을 입력해주세요."
        value={commentText}
        onChange={handleCommentChange}
        onKeyDown={handleSubmitCommentAsEnter}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={handleCompositionEnd}
      />
      <CButton type="submit" color="primary" disabled={!commentText.trim()}>
        작성
      </CButton>
    </CInputGroup>
  );

  return (
    <CForm onSubmit={handleSubmitComment} className="comments-section">
      <CCard className="mt-3 mb-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            댓글 <small className="text-muted">{`${postComments.length} 개`}</small>
          </div>
          <CFormCheck
            id="showDeletedComments"
            label="삭제된 댓글 표시"
            checked={showDeletedComments}
            onChange={(e) => setShowDeletedComments(e.target.checked)}
          />
        </CCardHeader>
        <CCardBody style={{ height: '300px', overflowY: 'auto' }}>{renderCommentList()}</CCardBody>
      </CCard>
      {renderCommentInput()}
    </CForm>
  );
};
export default PostCommentsForm;
