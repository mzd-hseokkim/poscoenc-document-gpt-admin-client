import React, { useCallback, useEffect, useState } from 'react';

import {
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
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import InputList from 'components/input/InputList';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import BoardService from 'services/board/BoardService';
import { userIdSelector } from 'states/jwtTokenState';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/formModes';

const BoardPostDetailForm = ({ initialFormMode, closeModal, refreshPosts }) => {
  const [postDetails, setPostDetails] = useState({});
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);
  //REMIND use setFormMode when implements posting service
  const [formMode, setFormMode] = useState(initialFormMode || '');
  const [searchParams] = useSearchParams();

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

  const fetchPostDetails = useCallback(
    async (postId) => {
      if (!postId) {
        return;
      }
      setGetDetailIsLoading(true);
      try {
        const detail = await BoardService.getPostDetail(postId);
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
          addToast({ message: `id={${postId}} 해당 게시글을 찾을 수 없습니다.` });
        } else {
          console.log(error);
        }
        closeModal();
      } finally {
        setGetDetailIsLoading(false);
      }
    },
    [addToast, closeModal, reset]
  );
  //REMIND 게시글 작성 후 모달 닫을 때 formMode read 로 설정해주기
  useEffect(() => {
    const postId = searchParams.get('id');

    if (!isCreateMode) {
      void fetchPostDetails(postId);
    }
  }, [closeModal, fetchPostDetails, isCreateMode, searchParams]);

  //REMIND 모달 닫을 때, 불필요한 데이터들 제거해는 로직 추가

  //REMIND separate modify logic with create logic when imple posting service
  const handleSubmitModifiedData = async (data) => {
    //REMIND hasFiles 관리 안하고 있는상태, 게시물 첨부파일 구현시 고려
    const modifiedData = {
      id: postDetails.id,
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
    } finally {
      setFormMode('read');
    }
  };
  const handleModificationCancelClick = async () => {
    setFormMode('read');
    await fetchPostDetails(postDetails.id);
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
                errors={errors}
              />
              <InputList
                register={register}
                fields={getAuditFields(formMode)}
                formData={postDetails}
                isReadMode={isReadMode}
                errors={errors}
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
        {isReadMode && <BoardCommentsForm postId={postDetails.id} />}
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={postDetails.id}
          formModes={formModes(formMode)}
          handleCancel={handleModificationCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={() => setFormMode('update')}
          isDataDeleted={deleted}
          isCreatedByCurrentUser={postDetails?.createdBy === currentUserId}
          onSubmit={handleSubmit(handleSubmitModifiedData)}
        />
      </CModalFooter>
    </>
  );
};

export default BoardPostDetailForm;
