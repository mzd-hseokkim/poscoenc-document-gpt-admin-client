import React, { useEffect, useState } from 'react';
import { CForm, CFormInput, CFormLabel, CFormTextarea, CSpinner } from '@coreui/react-pro';
import StatusBadge from './BoadStatusBadge';
import { format } from 'date-fns';
import BoardComments from './BoardComments';
import { useBoardPostDetails } from '../../hooks/board/useBoardPostDetails';

const BoardPostDetailsForm = ({ selectedId }) => {
  const { postDetails, loadingFlag } = useBoardPostDetails(selectedId);
  const [formData, setFormData] = useState(null);
  //REMIND formData 는 form 모드에 따라서 변경
  useEffect(() => {
    setFormData(postDetails);
  }, [postDetails]);
  if (loadingFlag) return <CSpinner variant="border"></CSpinner>;
  return (
    <CForm>
      <div>
        <div className="top-info" style={{ display: 'flex', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginRight: '.5rem', width: '60px' }}>
            <CFormLabel htmlFor="postId">ID</CFormLabel>
            <CFormInput type="number" id="postId" defaultValue={formData?.id} readOnly />
          </div>
          <div className="form-group" style={{ marginRight: '1rem', width: '90px' }}>
            <CFormLabel htmlFor="postTitle">작성자</CFormLabel>
            <CFormInput type="text" id="postTitle" defaultValue={formData?.createdByName} readOnly />
          </div>
          <div className="form-group" style={{ marginRight: '1rem', width: '60px' }}>
            <CFormLabel htmlFor="commentCount">댓글 수</CFormLabel>
            <CFormInput type="number" id="commentCount" defaultValue={formData?.comments?.length} readOnly />
          </div>
          <div className="form-group" style={{ marginRight: '1rem', width: '60px' }}>
            <CFormLabel htmlFor="postViews">조회수</CFormLabel>
            <CFormInput type="number" id="postViews" defaultValue={formData?.viewCount} readOnly />
          </div>

          <div className="form-group" style={{ marginRight: '1rem' }}>
            <CFormLabel htmlFor="postDate">작성일시</CFormLabel>
            <CFormInput
              type="text"
              id="postDate"
              defaultValue={formData?.createdAt ? format(new Date(formData?.createdAt), 'yyyy/MM/dd HH:mm:ss') : ''}
              readOnly
            />
          </div>
          <div className="form-group" style={{ marginRight: '1rem' }}>
            <CFormLabel htmlFor="modifiedDate">수정일시</CFormLabel>
            <CFormInput
              type="text"
              id="modifiedDate"
              defaultValue={formData?.modifiedAt ? format(new Date(formData?.modifiedAt), 'yyyy/MM/dd HH:mm:ss') : ''}
              readOnly
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
          <CFormLabel htmlFor="postContext">내용</CFormLabel>
          <CFormTextarea
            id="postContext"
            rows={10}
            placeholder="내용을 작성 해 주세요."
            defaultValue={formData?.content}
            readOnly
          ></CFormTextarea>
        </div>
        <div className="mb-3">
          {/*REMIND File 개수 3개 제한*/}
          <CFormInput
            disabled={!formData?.hasFiles}
            type="file"
            id="formFileMultiple"
            label="첨부파일 ( 최대 3개 첨부 가능 )"
            multiple
          />
        </div>
      </div>
      {/*      //REMIND 댓글 제출 이벤트핸들러 구현*/}
      <BoardComments formData={formData} handleSubmitComment={null} />
    </CForm>
  );
};

export default BoardPostDetailsForm;
