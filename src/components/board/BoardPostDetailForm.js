import React, { useEffect, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import BoardCommentsForm from 'components/board/BoardCommentsForm';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { useToast } from 'context/ToastContext';
import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';
import BoardService from 'services/board/BoardService';
import { userIdSelector } from 'states/jwtTokenState';

const BoardPostDetailForm = ({ clickedRowId, refreshPosts }) => {
  const [postDetails, setPostDetails] = useState(null);
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(true);

  const { addToast } = useToast();
  const currentUserId = useRecoilValue(userIdSelector);

  //REMIND 칼럼 정의 변수 명 수정하기
  const topInfoColumns = [
    { key: 'id', label: 'ID', _style: { width: '20%' } },
    { key: 'commentCount', label: '댓글수', _style: { width: '25%' } },
    { key: 'viewCount', label: '조회수', _style: { width: '25%' } },
    {
      key: 'deleted',
      label: '삭제 여부',
      _style: { width: '30%' },
    },
  ];

  const topInfoData = [
    {
      id: postDetails?.id,
      commentCount: postDetails?.comments ? postDetails.comments.length : 0,
      viewCount: postDetails?.viewCount,
      deleted: postDetails?.deleted,
    },
  ];

  const middleInfoColumns = [
    { key: 'createdByName', label: '작성자', _style: { width: '40%' } },
    {
      key: 'createdAt',
      label: '작성일시',
      _style: { width: '30%' },
    },
    {
      key: 'modifiedAt',
      label: '수정일시',
      _style: { width: '30%' },
    },
  ];
  const middleInfoData = [
    {
      createdByName: postDetails?.createdByName,
      createdAt: postDetails?.createdAt,
      modifiedAt: postDetails?.modifiedAt,
    },
  ];

  const topInfoScopedColumns = {
    deleted: (item) => (
      <td>
        <StatusBadge deleted={item.deleted} />
      </td>
    ),
  };
  const middleInfoScopedColumns = {
    createdAt: (item) => <td>{item.createdAt ? format(new Date(item.createdAt), 'yyyy/MM/dd HH:mm:ss') : ''}</td>,
    modifiedAt: (item) => <td>{item.modifiedAt ? format(new Date(item.modifiedAt), 'yyyy/MM/dd HH:mm:ss') : ''}</td>,
  };

  const infoTableHeaderProps = {
    color: 'light',
  };

  const infoTableProps = {
    bordered: true,
  };

  const fetchPostDetails = async () => {
    if (!clickedRowId) {
      return;
    }
    setGetDetailIsLoading(true);
    try {
      const details = await BoardService.getPostDetail(clickedRowId);
      setPostDetails(details);
    } catch (error) {
      if (error.response?.status === 404) {
        addToast({ message: '해당 게시글을 찾을 수 없습니다.' });
      } else {
        console.log(error);
      }
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

  const handleSubmitModifiedData = async (e) => {
    e.preventDefault();
    const submittedData = new FormData(e.target);
    const modifiedData = {
      id: clickedRowId,
      title: submittedData.get('postTitle'),
      content: submittedData.get('postContents'),
      hasFiles: submittedData.get('postFileUpload')?.size > 0 ?? false,
    };
    try {
      const isModified = await BoardService.putModifiedPostDetail(modifiedData);
      if (isModified) {
        await fetchPostDetails();
        await handleFormMode(true);
        await refreshPosts();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '본인이 작성한 게시글만 수정 가능합니다.' });
      } else if (status === 404) {
        addToast({ message: '수정할 게시글을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    }
  };

  const renderPostTitleInput = () => (
    <CRow className="mt-3">
      <CCol>
        <CFormLabel htmlFor="postTitle">제목</CFormLabel>
        <CFormInput
          type="text"
          id="postTitle"
          name="postTitle"
          defaultValue={postDetails?.title}
          readOnly={isViewMode}
        />
      </CCol>
    </CRow>
  );

  const renderPostContentTextarea = () => (
    <CRow className="mt-3">
      <CCol>
        <CFormLabel htmlFor="postContents">내용</CFormLabel>
        <CFormTextarea
          id="postContents"
          name="postContents"
          rows="5"
          placeholder="내용을 작성 해 주세요."
          defaultValue={postDetails?.content}
          readOnly={isViewMode}
        />
      </CCol>
    </CRow>
  );

  const renderFormActions = () => (
    <>
      {isViewMode && (
        <CRow className="row justify-content-end">
          {/*TODO fix to detail's createdBy (Long Id)*/}
          {postDetails?.createdBy === currentUserId && (
            <CCol className="col-auto mb-3">
              <CButton onClick={() => handleFormMode(false)}>수정</CButton>
            </CCol>
          )}
        </CRow>
      )}
      {!isViewMode && (
        <CRow className="justify-content-end">
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton type="submit">저장</CButton>
            <CButton type="reset" onClick={() => handleFormMode(true)}>
              취소
            </CButton>
          </CCol>
        </CRow>
      )}
    </>
  );

  return (
    <>
      <CForm onSubmit={handleSubmitModifiedData}>
        <CCard className="mb-3">
          <CCardBody>
            <CSmartTable
              columns={topInfoColumns}
              items={topInfoData}
              scopedColumns={topInfoScopedColumns}
              tableHeadProps={infoTableHeaderProps}
              tableProps={infoTableProps}
            />
            <CSmartTable
              columns={middleInfoColumns}
              items={middleInfoData}
              scopedColumns={middleInfoScopedColumns}
              tableHeadProps={infoTableHeaderProps}
              tableProps={infoTableProps}
            />
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
            {renderPostTitleInput()}
            {renderPostContentTextarea()}
          </CCardBody>
        </CCard>
        <CCard>
          {renderFormActions()}
          <FormLoadingCover isLoading={getDetailIsLoading} />
        </CCard>
      </CForm>
      {isViewMode && <BoardCommentsForm postId={clickedRowId} isViewMode={isViewMode} />}
    </>
  );
};

export default BoardPostDetailForm;
