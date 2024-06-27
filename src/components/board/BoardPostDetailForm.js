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
import PostCommentsForm from 'components/board/PostCommentsForm';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { AuditFields } from 'components/form/AuditFields';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import BoardService from 'services/board/BoardService';
import { userIdSelector } from 'states/jwtTokenState';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';

const BoardPostDetailForm = ({ initialFormMode, closeModal, refreshPosts }) => {
  const [postDetail, setPostDetail] = useState({});
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [searchParams] = useSearchParams();

  const postIdParam = searchParams.get('id');

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

  const fetchPostDetails = useCallback(async () => {
    if (!postIdParam) {
      return;
    }
    setGetDetailIsLoading(true);
    try {
      const detail = await BoardService.getPostDetail(postIdParam);
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
        addToast({ message: `id={${postIdParam}} 해당 게시글을 찾을 수 없습니다.` });
      } else {
        console.log(error);
      }
      closeModal();
    } finally {
      setGetDetailIsLoading(false);
    }
  }, [addToast, closeModal, postIdParam, reset]);

  useEffect(() => {
    if (!isCreateMode) {
      if (!postIdParam) {
        closeModal();
      } else {
        void fetchPostDetails();
      }
    }
  }, [closeModal, fetchPostDetails, isCreateMode, postIdParam]);

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
        addToast({ message: '새로운 게시글을 등록하였습니다.', color: 'success' });
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '잘못된 요청으로 게시글을 등록할 수 없습니다.' });
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
        addToast({ color: 'success', message: '게시글 수정이 완료되었습니다.' });
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '잘못된 요청입니다.' });
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
        <CFormLabel htmlFor="title" className="border-bottom">
          제목
        </CFormLabel>
        <CFormInput
          type="text"
          id="title"
          name="title"
          placeholder="제목을 작성 해 주세요."
          defaultValue={postDetail?.title}
          readOnly={isReadMode}
          plainText={isReadMode}
          {...register('title', {
            required: '제목을 작성 해 주세요.',
            validate: (value) => value.trim().length > 0 || '공백만으로 제목을 작성할 수 없습니다.',
          })}
          invalid={!!errors.title}
          feedbackInvalid={errors.title?.message}
        />
      </CCol>
      {!isCreateMode && (
        <CCol xs={2} className="text-end">
          <small>
            <CFormLabel className="text-muted">조회수 {postDetail?.viewCount}</CFormLabel>
          </small>
        </CCol>
      )}
    </CRow>
  );

  const renderPostContentTextarea = () => (
    <CRow className="mt-3">
      <CCol>
        <CFormLabel htmlFor="content" className="border-bottom">
          내용
        </CFormLabel>
        <CFormTextarea
          id="content"
          name="content"
          rows="5"
          placeholder="내용을 작성 해 주세요."
          defaultValue={postDetail?.content}
          readOnly={isReadMode}
          plainText={isReadMode}
          {...register('content', {
            required: '내용을 작성 해 주세요.',
            validate: (value) => value.trim().length > 0 || '공백만으로 내용을 작성할 수 없습니다.',
          })}
          invalid={!!errors.content}
          feedbackInvalid={errors.content?.message}
          className="border-dark"
        />
      </CCol>
    </CRow>
  );

  return (
    <>
      <FormLoadingCover isLoading={getDetailIsLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {!isCreateMode && <AuditFields formMode={formMode} formData={postDetail} isReadMode={isReadMode} />}
          <CCard className="border-3">
            <CCardBody>
              {renderPostTitleInput()}
              {renderPostContentTextarea()}
            </CCardBody>
          </CCard>
        </CForm>
        {isReadMode && (
          <PostCommentsForm
            totalCount={postDetail?.comments?.length}
            deletedCount={postDetail?.comments?.filter((comment) => comment.deleted).length}
          />
        )}
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
