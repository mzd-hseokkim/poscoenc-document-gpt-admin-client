import React from 'react';
import { CForm, CFormInput, CFormLabel, CFormTextarea } from '@coreui/react-pro';
import { format } from 'date-fns';
import StatusBadge from './BoadStatusBadge';

const BoardPostDetailsForm = ({ formData }) => {
  return (
    <CForm>
      <div>
        <CFormLabel htmlFor="postTitle">작성자</CFormLabel>
        <CFormInput type="text" id="postTitle" defaultValue={formData.createdByName} readOnly />
      </div>
      <div>
        <CFormLabel htmlFor="postContext">내용</CFormLabel>
        <CFormTextarea
          id="postContext"
          rows={10}
          placeholder="내용을 작성 해 주세요."
          defaultValue={formData.content}
          readOnly
        ></CFormTextarea>
      </div>
      <div className="mb-3">
        {/*REMIND File 개수 3개 제한*/}
        <CFormInput
          disabled={!formData.hasFiles}
          type="file"
          id="formFileMultiple"
          label="첨부파일 ( 최대 3개 첨부 가능 )"
          multiple
        />
      </div>
      <div>
        <CFormLabel htmlFor="postDate">작성일</CFormLabel>
        <CFormInput
          type="text"
          id="postDate"
          defaultValue={format(new Date(formData.createdAt), 'yyyy/MM/dd')}
          readOnly
        />
      </div>
      <div>
        <CFormLabel htmlFor="postViews">조회수</CFormLabel>
        <CFormInput type="number" id="postViews" defaultValue={formData.viewCount} readOnly />
      </div>
      <div>
        <CFormLabel htmlFor="postStatus" style={{ display: 'block', marginBottom: '10px' }}>
          상태
        </CFormLabel>
        <StatusBadge deleted={formData.deleted} />
      </div>
    </CForm>
  );
};

export default BoardPostDetailsForm;
