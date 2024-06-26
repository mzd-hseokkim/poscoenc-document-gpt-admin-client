import { useCallback, useEffect, useRef, useState } from 'react';

import { cilChevronBottom, cilChevronTop } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CRow,
} from '@coreui/react-pro';
import { useToast } from 'context/ToastContext';
import { useSearchParams } from 'react-router-dom';
import BoardCommentService from 'services/board/BoardCommentService';

const PostCommentsForm = ({ totalCount, deletedCount }) => {
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState([]);
  const [filterOption, setFilterOption] = useState('모두 표시');
  const [isComposing, setIsComposing] = useState(false);
  const [postCommentIsLoading, setPostCommentIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const endOfCommentsRef = useRef(null);

  const fetchPostComments = useCallback(async () => {
    if (!searchParams.get('id')) {
      return;
    }

    setPostCommentIsLoading(true);
    try {
      const comments = await BoardCommentService.getPostComments(searchParams.get('id'));
      setVisible(comments.length > 0);
      setPostComments(comments);
    } catch (error) {
      addToast({ message: '댓글을 불러오지 못했습니다. 관리자에게 문의하세요.' });
    } finally {
      setPostCommentIsLoading(false);
    }
  }, [addToast, searchParams]);

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
      await BoardCommentService.postComment(searchParams.get('id'), commentText);
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
  }, [fetchPostComments]);

  useEffect(() => {
    if (!postCommentIsLoading && visible) {
      setTimeout(() => {
        endOfCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
        //REMIND Collapse 가 열리고 이동하는데 걸려야 하는 최소 지연 시간
      }, 320);
    }
  }, [postCommentIsLoading, visible]);

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const renderCommentList = () => (
    <CRow>
      {postComments
        ?.filter((comment) => {
          if (filterOption === 'No') {
            return !comment.deleted;
          }
          if (filterOption === 'Yes') {
            return comment.deleted;
          }
          return true;
        })
        .map((comment, index) => renderCommentItem(comment, index))}
      <div ref={endOfCommentsRef} />
    </CRow>
  );

  const renderCommentItem = (comment, key) => {
    const commentCardStyles = {
      marginBottom: '1rem',
      backgroundColor: comment.deleted ? '#f8f9fa' : 'transparent',
    };

    const commentTextStyles = {
      textDecoration: comment.deleted ? 'line-through' : 'none',
      color: comment.deleted ? '#6c757d' : 'initial', // 회색 텍스트
      opacity: comment.deleted ? 0.5 : 1,
    };

    return (
      <CCol xs={12} key={key}>
        <CCard className={`comment-item mt-2 ${comment.deleted ? 'deleted-comment' : ''}`} style={commentCardStyles}>
          <CCardHeader>{renderCommentAuthorAndActions(comment)}</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol>
                <p style={commentTextStyles}>{comment.content}</p>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    );
  };

  const renderCommentAuthorAndActions = (comment) => (
    <CRow>
      <CCol className="d-flex justify-content-between">
        <strong>{comment.createdByName}</strong>
        <CButton
          className="in color-button-text-white"
          color={comment.deleted ? 'success' : 'danger'}
          size="sm"
          onClick={() => toggleCommentStatus(comment.id, !comment.deleted)}
        >
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
        <CCardHeader className="d-flex justify-content-between align-items-center border-bottom-0">
          <div className="d-flex align-items-center">
            댓글{' '}
            <small className="text-muted text white-space-pre">{` ${
              totalCount - deletedCount
            } 개, 삭제된 댓글 ${deletedCount} 개`}</small>
            <CIcon
              onClick={() => setVisible((prev) => !prev)}
              style={{ cursor: 'pointer' }}
              icon={!visible ? cilChevronBottom : cilChevronTop}
              className="ms-2"
            />
          </div>
          <CFormSelect
            style={{ width: '175px' }}
            options={[
              { label: '모두 표시', value: 'ALL' },
              { label: '삭제된 댓글 무시', value: 'No' },
              { label: '삭제된 댓글만 표시', value: 'Yes' },
            ]}
            onChange={handleFilterChange}
          ></CFormSelect>
        </CCardHeader>
        <CCollapse visible={visible}>
          <CCardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>{renderCommentList()}</CCardBody>
        </CCollapse>
      </CCard>
      {renderCommentInput()}
    </CForm>
  );
};
export default PostCommentsForm;
