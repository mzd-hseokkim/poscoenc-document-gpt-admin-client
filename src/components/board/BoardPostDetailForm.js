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
  CModalBody,
  CModalFooter,
  CRow,
} from '@coreui/react-pro';
import BoardCommentsForm from 'components/board/BoardCommentsForm';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import InputList from 'components/input/InputList';
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
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const deleted = watch('deleted');

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

  const handleDeleteRestoreClick = async (postId) => {
    const shouldDelete = !deleted;
    try {
      await BoardService.patchPostsDeletionOption([postId], shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    await fetchPostDetails();
    refreshPosts();
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
    <CRow className="justify-content-end">
      {isReadMode && postDetails?.createdBy === currentUserId && (
        <CCol className="d-grid d-md-flex justify-content-md-end gap-2">
          <CButton className="me-1" onClick={() => setFormMode('update')}>
            수정
          </CButton>
          {!isCreateMode && (
            <CButton onClick={() => handleDeleteRestoreClick(clickedRowId)}>{deleted ? '복구' : '삭제'}</CButton>
          )}
        </CCol>
      )}
      {!isReadMode && (
        <CCol className="d-grid d-md-flex justify-content-md-end gap-2">
          <CButton className="me-1" type="submit" onClick={handleSubmit(handleSubmitModifiedData)}>
            저장
          </CButton>
          <CButton className="me-1" type="reset" onClick={() => setFormMode('read')}>
            취소
          </CButton>
          {!isCreateMode && (
            <CButton onClick={() => handleDeleteRestoreClick(clickedRowId)}>{deleted ? '복구' : '삭제'}</CButton>
          )}
        </CCol>
      )}
    </CRow>
  );

  return (
    <>
      <FormLoadingCover isLoading={getDetailIsLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(handleSubmitModifiedData)}>
          <CCard className="mb-3">
            <CCardBody>
              <InputList
                register={register}
                fields={postSpecificFields}
                formData={postDetails}
                isReadMode={isReadMode}
              />
              <InputList
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
            </CCardBody>
          </CCard>
        </CForm>
        {isReadMode && <BoardCommentsForm postId={clickedRowId} />}
      </CModalBody>
      <CModalFooter>{renderFormActions()}</CModalFooter>
    </>
  );
};

export default BoardPostDetailForm;
