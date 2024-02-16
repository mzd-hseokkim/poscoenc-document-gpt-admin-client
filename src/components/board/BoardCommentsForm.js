import { useEffect, useRef, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormText,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react-pro';
import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';

import useToast from '../../hooks/useToast';
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

  const handleShowDeletedCommentsChange = (event) => {
    setShowDeletedComments(event.target.checked);
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
    // REMIND 현재는 본인이 답글 달 때만 아래로 스크롤, 추후 새로운 댓글이 달렸을 때 아래로 스크롤 하는걸 고려
  }, [postCommentIsLoading]);

  return (
    <CForm onSubmit={handleCommentSubmit} className="comments-section">
      <CCard className="mt-3 mb-3">
        <CCardHeader htmlFor="postComments" className="d-flex justify-content-between">
          댓글
          <CFormCheck
            id="showDeletedComments"
            label="삭제된 댓글 표시"
            className="ms-auto"
            checked={showDeletedComments}
            onChange={handleShowDeletedCommentsChange}
          ></CFormCheck>
        </CCardHeader>

        <CCardBody style={{ height: '180px', overflowY: 'auto' }}>
          <CRow>
            {postComments?.map((comment, index) => {
              if (!showDeletedComments && comment.deleted) {
                return <CCol key={index} xs={12} style={{ display: 'none' }}></CCol>;
              }
              return (
                <CCol xs={12} key={index}>
                  <CCard
                    className={`comment-item mt-2 ${comment.deleted ? 'deleted-comment' : ''} border-bottom-1`}
                    style={{ height: '100px' }}
                  >
                    <CCardHeader>
                      <CRow>
                        <CCol xs={9} className="d-flex align-items-center">
                          <strong>{comment.createdByName}</strong>
                        </CCol>
                        {comment.createdByName === currentUserId && (
                          <CCol xs={3} className="d-flex justify-content-end">
                            <CButton
                              color="primary"
                              size="sm"
                              onClick={() => toggleCommentStatus(comment.id, !comment.deleted)}
                            >
                              {comment.deleted ? '복구' : '삭제'}
                            </CButton>
                          </CCol>
                        )}
                      </CRow>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol xs={9}>
                          <CFormText
                            className="mb-1"
                            style={{
                              textDecoration: comment.deleted ? 'line-through' : 'none',
                              color: comment.deleted ? '#6c757d' : 'initial',
                            }}
                          >
                            {comment.content}
                          </CFormText>
                        </CCol>
                        <CCol xs={3} className="d-flex justify-content-end">
                          <CFormText>{format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm:ss')}</CFormText>
                        </CCol>
                        <div ref={endOfCommentsRef} />
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              );
            })}
          </CRow>
        </CCardBody>
      </CCard>
      <CInputGroup className="mb-2 mt-3">
        <CInputGroupText>댓글</CInputGroupText>
        <CFormTextarea rows={1} placeholder="댓글을 입력해주세요." value={commentText} onChange={handleCommentChange} />
        <CButton disabled={!commentText.trim()} type="submit" style={{ cursor: 'pointer' }}>
          작성
        </CButton>
      </CInputGroup>
    </CForm>
  );
};
export default BoardCommentsForm;
