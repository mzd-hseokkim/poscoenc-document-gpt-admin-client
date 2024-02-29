import React, { useEffect, useState } from 'react';

import { CButton, CCard, CCardBody, CCol, CForm, CFormInput, CFormLabel, CFormTextarea, CRow } from '@coreui/react-pro';
import BoardCommentsForm from 'components/board/BoardCommentsForm';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import HorizontalCFormInputList from 'components/input/HorizontalCFormInputList';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import BoardService from 'services/board/BoardService';
import { userIdSelector } from 'states/jwtTokenState';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/formModes';

const BoardPostDetailForm = ({ clickedRowId, initialFormMode, closeModal, refreshPosts }) => {
  const [postDetails, setPostDetails] = useState({});
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);
  //REMIND use setFormMode when implements posting service
  const [formMode, setFormMode] = useState(initialFormMode || '');

  const { addToast } = useToast();
  const currentUserId = useRecoilValue(userIdSelector);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  //REMIND 칼럼 정의 변수 명 수정하기

  const postSpecificFields = [
    {
      md: 2,
      name: 'id',
      label: '아이디',
      isDisabled: isUpdateMode,
      isRendered: !isCreateMode,
    },
    {
      name: 'commentCount',
      label: '댓글수',
      isDisabled: isUpdateMode,
    },
    {
      name: 'viewCount',
      label: '조회수',
      isDisabled: isUpdateMode,
    },
    {
      md: 2,
      name: 'deleted',
      label: '삭제 여부',
    },
  ];

  const fetchPostDetails = async () => {
    if (!clickedRowId) {
      return;
    }
    setGetDetailIsLoading(true);
    try {
      const detail = await BoardService.getPostDetail(clickedRowId);
      const formattedDetail = {
        ...detail,
        commentCount: detail.comments.length,
        createdAt: detail.createdAt && formatToYMD(detail.createdAt),
        modifiedAt: detail.modifiedAt && formatToYMD(detail.modifiedAt),
      };
      setPostDetails(formattedDetail);
      reset(formattedDetail);
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
    if (!isCreateMode) {
      fetchPostDetails();
    } else {
      //REMIND imple post service
    }
  }, [clickedRowId]);

  //REMIND separate modify logic with create logic when imple posting service
  const handleSubmitModifiedData = async (data) => {
    //REMIND hasFiles 관리 안하고 있는상태, 게시물 첨부파일 구현시 고려
    const modifiedData = {
      id: clickedRowId,
      ...data,
    };
    try {
      const isModified = await BoardService.putModifiedPostDetail(modifiedData);
      if (isModified) {
        await setFormMode('read');
        refreshPosts();
        await fetchPostDetails();
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
        <CFormLabel htmlFor="title">제목</CFormLabel>
        <CFormInput
          type="text"
          id="title"
          name="title"
          defaultValue={postDetails?.title}
          readOnly={isReadMode}
          {...register('title')}
        />
      </CCol>
    </CRow>
  );

  const renderPostContentTextarea = () => (
    <CRow className="mt-3">
      <CCol>
        <CFormLabel htmlFor="content">내용</CFormLabel>
        <CFormTextarea
          id="content"
          name="content"
          rows="5"
          placeholder="내용을 작성 해 주세요."
          defaultValue={postDetails?.content}
          readOnly={isReadMode}
          {...register('content')}
        />
      </CCol>
    </CRow>
  );

  const renderFormActions = () => (
    <>
      {isReadMode && (
        <CRow className="row mt-3 justify-content-end">
          {postDetails?.createdBy === currentUserId && (
            <CCol className="col-auto">
              <CButton onClick={() => setFormMode('update')}>수정</CButton>
            </CCol>
          )}
        </CRow>
      )}
      {!isReadMode && (
        <CRow className="justify-content-end">
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton type="submit" onClick={handleSubmit(handleSubmitModifiedData)}>
              저장
            </CButton>
            <CButton type="reset" onClick={() => setFormMode('read')}>
              취소
            </CButton>
          </CCol>
        </CRow>
      )}
    </>
  );

  return (
    <>
      <CForm onSubmit={handleSubmit(handleSubmitModifiedData)}>
        <CCard className="mb-3">
          <CCardBody>
            <HorizontalCFormInputList
              register={register}
              fields={postSpecificFields}
              formData={postDetails}
              isReadMode={isReadMode}
            />
            <HorizontalCFormInputList
              register={register}
              fields={getAuditFields(formMode)}
              formData={postDetails}
              isReadMode={isReadMode}
            />
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
            {renderPostTitleInput()}
            {renderPostContentTextarea()}
            {renderFormActions()}
            <FormLoadingCover isLoading={getDetailIsLoading} />
          </CCardBody>
        </CCard>
      </CForm>
      {isReadMode && <BoardCommentsForm postId={clickedRowId} />}
    </>
  );
};

export default BoardPostDetailForm;
