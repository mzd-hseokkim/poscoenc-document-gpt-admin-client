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
import FormInputGrid from 'components/input/FormInputGrid';
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
  const [postDetail, setPostDetail] = useState({});
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
      isRendered: !isCreateMode,
    },
    {
      name: 'viewCount',
      label: '조회수',
      isDisabled: isUpdateMode,
      isRendered: !isCreateMode,
    },
    {
      md: 2,
      name: 'deleted',
      label: '삭제 여부',
      isRendered: !isCreateMode,
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
        setPostDetail(formattedDetail);
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

  const onSubmit = (data) => {
    if (isCreateMode) {
      void handleSubmitNewPost(data);
    } else if (isUpdateMode) {
      void handleSubmitModifiedPost(data);
    }
  };
  const handleSubmitNewPost = async (newPost) => {
    //REMIND 첨부파일 구현시 고려
    const newPostData = {
      ...newPost,
      hasFiles: false,
    };
    try {
      const isSucceed = await BoardService.postNew(newPostData);
      if (isSucceed) {
        closeModal();
        refreshPosts();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '게시글을 등록할 수 없습니다.' });
      }
    }
  };
  const handleSubmitModifiedPost = async (data) => {
    //REMIND hasFiles 관리 안하고 있는상태, 게시물 첨부파일 구현시 고려
    const modifiedData = {
      id: postDetail.id,
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
    await fetchPostDetails(postDetail.id);
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

  const handleCancelClick = async () => {
    if (isUpdateMode) {
      setFormMode('read');
      await fetchPostDetails();
    } else if (isCreateMode) {
      closeModal();
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
          placeholder="제목을 작성 해 주세요."
          defaultValue={postDetail?.title}
          readOnly={isReadMode}
          {...register('title', {
            required: '제목을 작성 해 주세요.',
            validate: (value) => value.trim().length > 0 || '공백만으로 제목을 작성할 수 없습니다.',
          })}
          invalid={!!errors.title}
          feedbackInvalid={errors.title?.message}
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
          defaultValue={postDetail?.content}
          readOnly={isReadMode}
          {...register('content', {
            required: '내용을 작성 해 주세요.',
            validate: (value) => value.trim().length > 0 || '공백만으로 내용을 작성할 수 없습니다.',
          })}
          invalid={!!errors.content}
          feedbackInvalid={errors.content?.message}
        />
      </CCol>
    </CRow>
  );

  return (
    <>
      <FormLoadingCover isLoading={getDetailIsLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {!isCreateMode && (
            <CCard className="mb-3">
              <CCardBody>
                <FormInputGrid
                  register={register}
                  fields={postSpecificFields}
                  formData={postDetail}
                  isReadMode={isReadMode}
                  errors={errors}
                />
                <FormInputGrid
                  register={register}
                  fields={getAuditFields(formMode)}
                  formData={postDetail}
                  isReadMode={isReadMode}
                  errors={errors}
                />
              </CCardBody>
            </CCard>
          )}
          <CCard>
            <CCardBody>
              {renderPostTitleInput()}
              {renderPostContentTextarea()}
            </CCardBody>
          </CCard>
        </CForm>
        {isReadMode && <BoardCommentsForm postId={postDetail.id} />}
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={postDetail.id}
          formModes={formModes(formMode)}
          handleCancel={handleCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={() => setFormMode('update')}
          isDataDeleted={deleted}
          isCreatedByCurrentUser={postDetail?.createdBy === currentUserId}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};

export default BoardPostDetailForm;
