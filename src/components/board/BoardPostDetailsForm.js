import React, { useEffect, useState } from 'react';

import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CFormTextarea,
  CListGroup,
  CListGroupItem,
  CSpinner,
} from '@coreui/react-pro';
import { format } from 'date-fns';

import StatusBadge from './BoadStatusBadge';
import BoardCommentsForm from './BoardCommentsForm';
import useBoardPostDetails from '../../hooks/board/useBoardPostDetails';
import useToast from '../../hooks/useToast';
import { putModifiedPostDetailsApi } from '../../services/board/BoardService';

const BoardPostDetailsForm = ({ clickedRowId }) => {
  const boardPostDetails = useBoardPostDetails(clickedRowId);
  const [isViewMode, setIsViewMode] = useState(true);

  const addToast = useToast();

  const [formData, setFormData] = useState(null);
  useEffect(() => {
    setFormData(boardPostDetails.postDetails);
  }, [boardPostDetails.postDetails]);
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
      await putModifiedPostDetailsApi(modifiedData);
    } catch (error) {
      console.log('touched');
      addToast({ color: 'danger', message: error.message });
    }
    await boardPostDetails.fetchPostDetails();
    handleFormMode(true);
  };

  if (boardPostDetails.isLoading) return <CSpinner variant="border"></CSpinner>;
  return (
    <>
      <CForm onSubmit={handleSubmit}>
        <div>
          <div className="top-info" style={{ display: 'flex', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginRight: '.5rem', width: '60px' }}>
              <CFormLabel htmlFor="postId">ID</CFormLabel>
              <CFormText id="postId" name="postId" readOnly disabled={!isViewMode}>
                {formData?.id}
              </CFormText>
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '90px' }}>
              <CFormLabel htmlFor="postCreatedByName">작성자</CFormLabel>
              <CFormText id="postCreatedByName" readOnly disabled={!isViewMode}>
                {formData?.createdByName}
              </CFormText>
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '60px' }}>
              <CFormLabel htmlFor="commentCount">댓글 수</CFormLabel>
              <CFormText type="number" id="commentCount" readOnly disabled={!isViewMode}>
                {formData?.comments?.length}
              </CFormText>
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '60px' }}>
              <CFormLabel htmlFor="postViews">조회수</CFormLabel>
              <CFormText type="number" id="postViews" readOnly disabled={!isViewMode}>
                {formData?.viewCount}
              </CFormText>
            </div>
          </div>
          <div className="middle-info" style={{ display: 'flex', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginRight: '1rem' }}>
              <CFormLabel htmlFor="postDate">작성일시</CFormLabel>
              <CFormText id="postDate">
                {formData?.createdAt ? format(new Date(formData?.createdAt), 'yyyy/MM/dd HH:mm:ss') : ''}
              </CFormText>
            </div>
            <div className="form-group" style={{ marginRight: '1rem' }}>
              <CFormLabel htmlFor="modifiedDate">수정일시</CFormLabel>
              <CFormText id="modifiedDate">
                {formData?.modifiedAt ? format(new Date(formData?.modifiedAt), 'yyyy/MM/dd HH:mm:ss') : ''}
              </CFormText>
            </div>
            <div className="form-group">
              <CFormLabel htmlFor="postStatus">삭제 여부</CFormLabel>
              <div>
                <StatusBadge id="postStatus" deleted={formData?.deleted} />
              </div>
            </div>
          </div>
          <div>
            <CFormLabel htmlFor="postTitle">제목</CFormLabel>
            <CFormInput
              type="text"
              id="postTitle"
              name="postTitle"
              defaultValue={formData?.title}
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
              defaultValue={formData?.content}
              readOnly={isViewMode}
            ></CFormTextarea>
          </div>
          {/*REMIND File 개수 3개 제한*/}
          {isViewMode && (
            <div>
              {formData?.hasFiles && (
                <>
                  <CFormLabel htmlFor="postFiles">첨부파일</CFormLabel>
                  <CListGroup id="postFiles" name="postFiles" className="mb-3">
                    <CListGroupItem>첨부파일 1 ( 미구현 )</CListGroupItem>
                  </CListGroup>
                </>
              )}
              {/* List attached files here */}
            </div>
          )}
          {!isViewMode && (
            <>
              <CFormInput
                disabled={isViewMode}
                type="file"
                id="postFileUpload"
                name="postFileUpload"
                label="파일 업로드 ( 최대 3개 )"
                multiple
              />
            </>
          )}
        </div>
        {/*REMIND 작성자만 수정 가능하도록 변경*/}
        {isViewMode && (
          <div className="row justify-content-end">
            <div className="col-auto mb-3">
              <CButton
                onClick={() => {
                  handleFormMode(false);
                }}
              >
                수정
              </CButton>
            </div>
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

export default BoardPostDetailsForm;
