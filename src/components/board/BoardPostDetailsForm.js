import React, { useEffect, useState } from 'react';

import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CListGroup,
  CListGroupItem,
  CSpinner,
} from '@coreui/react-pro';
import { format } from 'date-fns';

import StatusBadge from './BoadStatusBadge';
import BoardComments from './BoardComments';
import useBoardPostDetails from '../../hooks/board/useBoardPostDetails';
import { modifyPostDetails } from '../../services/board/BoardService';

const BoardPostDetailsForm = ({ selectedId }) => {
  const { postDetails, isLoading } = useBoardPostDetails(selectedId);
  const [isViewMode, setIsViewMode] = useState(true);

  const [formData, setFormData] = useState(null);
  //REMIND formData 는 form 모드에 따라서 변경
  useEffect(() => {
    setFormData(postDetails);
  }, [postDetails]);
  const handleFormMode = (isViewMode) => {
    setIsViewMode(isViewMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = new FormData(e.target);
    console.table(e);
    const modifiedData = {
      id: selectedId,
      title: submittedData.get('postTitle'),
      content: submittedData.get('postContents'),
      hasFiles: submittedData.get('postFileUpload')?.size > 0 ?? false,
    };
    modifyPostDetails(modifiedData);
    handleFormMode(true);
  };

  if (isLoading) return <CSpinner variant="border"></CSpinner>;
  return (
    <>
      <CForm onSubmit={handleSubmit}>
        <div>
          <div className="top-info" style={{ display: 'flex', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginRight: '.5rem', width: '60px' }}>
              <CFormLabel htmlFor="postId">ID</CFormLabel>
              <CFormInput
                type="number"
                id="postId"
                name="postId"
                defaultValue={formData?.id}
                readOnly
                disabled={!isViewMode}
              />
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '90px' }}>
              <CFormLabel htmlFor="postCreatedByName">작성자</CFormLabel>
              <CFormInput
                type="text"
                id="postCreatedByName"
                defaultValue={formData?.createdByName}
                readOnly
                disabled={!isViewMode}
              />
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '60px' }}>
              <CFormLabel htmlFor="commentCount">댓글 수</CFormLabel>
              <CFormInput
                type="number"
                id="commentCount"
                defaultValue={formData?.comments?.length}
                readOnly
                disabled={!isViewMode}
              />
            </div>
            <div className="form-group" style={{ marginRight: '1rem', width: '60px' }}>
              <CFormLabel htmlFor="postViews">조회수</CFormLabel>
              <CFormInput
                type="number"
                id="postViews"
                defaultValue={formData?.viewCount}
                readOnly
                disabled={!isViewMode}
              />
            </div>

            <div className="form-group" style={{ marginRight: '1rem' }}>
              <CFormLabel htmlFor="postDate">작성일시</CFormLabel>
              <CFormInput
                type="text"
                id="postDate"
                defaultValue={formData?.createdAt ? format(new Date(formData?.createdAt), 'yyyy/MM/dd HH:mm:ss') : ''}
                readOnly
                disabled={!isViewMode}
              />
            </div>
            <div className="form-group" style={{ marginRight: '1rem' }}>
              <CFormLabel htmlFor="modifiedDate">수정일시</CFormLabel>
              <CFormInput
                type="text"
                id="modifiedDate"
                defaultValue={formData?.modifiedAt ? format(new Date(formData?.modifiedAt), 'yyyy/MM/dd HH:mm:ss') : ''}
                readOnly
                disabled={!isViewMode}
              />
            </div>
            <div className="form-group">
              <CFormLabel htmlFor="postStatus">상태</CFormLabel>
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
              rows={10}
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
                    <CListGroupItem>첨부파일 1</CListGroupItem>
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
        {/*REMIND 댓글 제출 이벤트핸들러 구현*/}
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
        {isViewMode && <BoardComments formData={formData} isViewMode={isViewMode} />}
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
    </>
  );
};

export default BoardPostDetailsForm;
