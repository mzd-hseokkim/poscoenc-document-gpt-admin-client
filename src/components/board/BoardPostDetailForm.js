import React, { useEffect, useState } from 'react';

import { CButton, CForm, CFormInput, CFormLabel, CFormText, CFormTextarea, CSpinner } from '@coreui/react-pro';
import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';

import StatusBadge from './BoadStatusBadge';
import BoardCommentsForm from './BoardCommentsForm';
import useToast from '../../hooks/useToast';
import BoardService from '../../services/board/BoardService';
import { userIdSelector } from '../../states/jwtTokenState';

const BoardPostDetailForm = ({ clickedRowId, refreshPosts }) => {
  const [postDetails, setPostDetails] = useState(null);
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(true);

  const addToast = useToast();
  const currentUserId = useRecoilValue(userIdSelector);

  const fetchPostDetails = async () => {
    setGetDetailIsLoading(true);
    try {
      const details = await BoardService.getPostDetails(clickedRowId);
      setPostDetails(details);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setGetDetailIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [clickedRowId]);

  const handleFormMode = (isViewMode) => {
    setIsViewMode(isViewMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedData = new FormData(e.target);
    const modifiedData = {
      id: clickedRowId,
      title: submittedData.get('postTitle'),
      content: submittedData.get('postContents'),
      hasFiles: submittedData.get('postFileUpload')?.size > 0 ?? false,
    };
    try {
      await BoardService.putModifiedPostDetails(modifiedData);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    }
    await fetchPostDetails();
    await handleFormMode(true);
    await refreshPosts();
  };

  if (getDetailIsLoading) return <CSpinner variant="border" />;

  return (
    <>
      <CForm onSubmit={handleSubmit}>
        <div>
          <div className="top-info" style={{ display: 'flex', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginRight: '.5rem', width: '60px' }}>
              <CFormLabel htmlFor="postId">ID</CFormLabel>
              <CFormText id="postId" name="postId" readOnly disabled={!isViewMode}>
                {postDetails?.id}
              </CFormText>
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '90px' }}>
              <CFormLabel htmlFor="postCreatedByName">작성자</CFormLabel>
              <CFormText id="postCreatedByName" readOnly disabled={!isViewMode}>
                {postDetails?.createdByName}
              </CFormText>
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '60px' }}>
              <CFormLabel htmlFor="commentCount">댓글 수</CFormLabel>
              <CFormText type="number" id="commentCount" readOnly disabled={!isViewMode}>
                {postDetails?.comments?.length}
              </CFormText>
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '60px' }}>
              <CFormLabel htmlFor="postViews">조회수</CFormLabel>
              <CFormText type="number" id="postViews" readOnly disabled={!isViewMode}>
                {postDetails?.viewCount}
              </CFormText>
            </div>
          </div>
          <div className="middle-info" style={{ display: 'flex', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginRight: '1rem' }}>
              <CFormLabel htmlFor="postDate">작성일시</CFormLabel>
              <CFormText id="postDate">
                {postDetails?.createdAt ? format(new Date(postDetails?.createdAt), 'yyyy/MM/dd HH:mm:ss') : ''}
              </CFormText>
            </div>
            <div className="form-group" style={{ marginRight: '1rem' }}>
              <CFormLabel htmlFor="modifiedDate">수정일시</CFormLabel>
              <CFormText id="modifiedDate">
                {postDetails?.modifiedAt ? format(new Date(postDetails?.modifiedAt), 'yyyy/MM/dd HH:mm:ss') : ''}
              </CFormText>
            </div>
            <div className="form-group">
              <CFormLabel htmlFor="postStatus">삭제 여부</CFormLabel>
              <div>
                <StatusBadge id="postStatus" deleted={postDetails?.deleted} />
              </div>
            </div>
          </div>
          <div>
            <CFormLabel htmlFor="postTitle">제목</CFormLabel>
            <CFormInput
              type="text"
              id="postTitle"
              name="postTitle"
              defaultValue={postDetails?.title}
              readOnly={isViewMode}
            ></CFormInput>
          </div>
          <div>
            <CFormLabel htmlFor="postContents">내용</CFormLabel>
            <CFormTextarea
              className="mb-3"
              id="postContents"
              name="postContents"
              rows={5}
              placeholder="내용을 작성 해 주세요."
              defaultValue={postDetails?.content}
              readOnly={isViewMode}
            ></CFormTextarea>
          </div>
        </div>
        {/*REMIND 작성자만 수정 가능하도록 변경*/}
        {isViewMode && (
          <div className="row justify-content-end">
            {/*REMIND comment 와 post 에 createdBy Id 도 반환할수있도록 변경요청*/}
            {postDetails?.createdByName === currentUserId && (
              <div className="col-auto mb-3">
                <CButton
                  onClick={() => {
                    handleFormMode(false);
                  }}
                >
                  수정
                </CButton>
              </div>
            )}
          </div>
        )}
        {!isViewMode && (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton type="submit" className="mt-2 me-0">
              저장
            </CButton>
            <CButton
              type="reset"
              className="mt-2 me-0"
              onClick={() => {
                handleFormMode(true);
              }}
            >
              취소
            </CButton>
          </div>
        )}
      </CForm>
      {/*REMIND 댓글 제출 이벤트핸들러 구현*/}
      {isViewMode && <BoardCommentsForm postId={clickedRowId} isViewMode={isViewMode} />}
    </>
  );
};

export default BoardPostDetailForm;
