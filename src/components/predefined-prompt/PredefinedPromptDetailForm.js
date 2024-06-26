import React, { useCallback, useEffect, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModalBody,
  CModalFooter,
  CRow,
} from '@coreui/react-pro';
import PromptApprovalStatusBadge from 'components/badge/PromptApprovalStatusBadge';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { AuditFields } from 'components/form/AuditFields';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import PredefinedPromptService from 'services/predefined-prompt/PredefinedPromptService';
import { userIdSelector } from 'states/jwtTokenState';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';

export const PredefinedPromptDetailForm = ({ initialFormMode, closeModal, refreshPredefinedPromptList }) => {
  const [predefinedPromptDetail, setPredefinedPromptDetail] = useState({});
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchParams] = useSearchParams();

  const { addToast } = useToast();
  const currentUserId = useRecoilValue(userIdSelector);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const {
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const deleted = watch('deleted');
  const predefinedPromptId = searchParams.get('id');
  const onSubmit = async (data) => {
    if (isCreateMode) {
      void postNewPredefinedPrompt(data);
    } else if (isUpdateMode) {
      void putModifiedPredefinedPrompt(data);
    }
  };

  const fetchPredefinedPromptDetails = useCallback(
    async (promptId) => {
      setGetDetailIsLoading(true);
      try {
        const detail = await PredefinedPromptService.getPredefinedPromptDetail(promptId);
        if (detail) {
          const formattedDetail = {
            ...detail,
            createdAt: detail.createdAt && formatToYMD(detail.createdAt),
            modifiedAt: detail.modifiedAt && formatToYMD(detail.modifiedAt),
          };
          setPredefinedPromptDetail(formattedDetail);
          reset(formattedDetail);
          setHasError(false);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          addToast({ message: `id={${promptId}} 해당 프롬프트를 찾을 수 없습니다.` });
        } else {
          addToast({ message: '프롬프트 정보를 가져오지 못했습니다.' });
        }
        console.log(error);
        setHasError(true);
        closeModal();
      } finally {
        setGetDetailIsLoading(false);
      }
    },
    [addToast, closeModal, reset]
  );

  useEffect(() => {
    if (!isCreateMode && !predefinedPromptId) {
      closeModal();
      return;
    }
    if (!isCreateMode && !hasError) {
      void fetchPredefinedPromptDetails(predefinedPromptId);
    }

    if (isCreateMode) {
      setValue('approved', true);
    }
  }, [closeModal, fetchPredefinedPromptDetails, hasError, isCreateMode, predefinedPromptId, setValue]);

  const postNewPredefinedPrompt = async (newPrompt) => {
    try {
      const isSucceed = await PredefinedPromptService.postPredefinedPrompt(newPrompt);
      if (isSucceed) {
        closeModal();
        refreshPredefinedPromptList();
        addToast({ message: '새로운 프롬프트를 등록하였습니다.', color: 'success' });
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '잘못된 요청으로 프롬프트를 등록 할 수 없습니다.' });
      }
    } finally {
    }
  };

  const putModifiedPredefinedPrompt = async (data) => {
    const modifiedData = {
      id: predefinedPromptId,

      ...data,
    };
    try {
      const isModified = await PredefinedPromptService.putModifiedPredefinedPromptDetail(modifiedData);
      if (isModified) {
        await setFormMode('read');
        setPredefinedPromptDetail({});
        await fetchPredefinedPromptDetails(searchParams.get('id'));
        refreshPredefinedPromptList();
        addToast({ color: 'success', message: '프롬프트 수정이 완료되었습니다.' });
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '잘못된 요청입니다.' });
      } else if (status === 404) {
        addToast({ message: '수정할 프롬프트를 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    }
  };
  const handleModificationCancelClick = async () => {
    if (isUpdateMode) {
      setFormMode('read');
      await fetchPredefinedPromptDetails(searchParams.get('id'));
    } else if (isCreateMode) {
      closeModal();
    }
  };
  const handleDeleteRestoreClick = async (promptId) => {
    console.log(deleted);
    const shouldDelete = !deleted;
    try {
      await PredefinedPromptService.patchPredefinedPromptDeletionOption([promptId], shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    await fetchPredefinedPromptDetails(searchParams.get('id'));
    refreshPredefinedPromptList();
  };

  return (
    <>
      <FormLoadingCover isLoading={getDetailIsLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {!isCreateMode && (
            <AuditFields formMode={formMode} formData={predefinedPromptDetail} isReadMode={isReadMode} />
          )}
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <CInputGroup style={{ marginBottom: !isReadMode ? '1rem' : '0' }}>
                    {!isReadMode && <CInputGroupText>이름</CInputGroupText>}
                    <CFormInput
                      style={{ fontWeight: 'bold' }}
                      size="lg"
                      type="text"
                      id="detailName"
                      name="detailName"
                      placeholder=""
                      defaultValue={predefinedPromptDetail?.name}
                      readOnly={isReadMode}
                      plainText={isReadMode}
                      {...register('name', {
                        required: '프롬프트 이름을 작성 해 주세요.',
                        validate: (value) => value.trim().length > 0 || '공백만으로 이름을 지을 수 없습니다.',
                      })}
                      invalid={!!errors.name}
                      feedbackInvalid={errors.name?.message}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CInputGroup style={{ marginBottom: '1rem' }}>
                    {!isReadMode && <CInputGroupText>설명</CInputGroupText>}
                    <>
                      <CFormTextarea
                        id="detailDescription"
                        name="description"
                        className="text-muted"
                        placeholder=""
                        rows={3}
                        defaultValue={predefinedPromptDetail?.description}
                        readOnly={isReadMode}
                        plainText={isReadMode}
                        {...register('description', {
                          required: '프롬프트 설명을 작성 해 주세요.',
                          validate: (value) => value.trim().length > 0 || '공백만으로 설명을 작성할 수 없습니다.',
                        })}
                        invalid={!!errors.description}
                        feedbackInvalid={errors.description?.message}
                      />
                    </>
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow className="mt-2">
                <CCol
                  sm={5}
                  style={{
                    marginLeft: '1rem',
                    borderLeft: 'solid 3px',
                    borderColor: 'gray',
                  }}
                >
                  <CFormLabel
                    className="text-muted"
                    style={{ fontSize: '0.875rem', marginBottom: isCreateMode ? '1rem' : '' }}
                    htmlFor="detailCategory"
                  >
                    카테고리
                  </CFormLabel>
                  <CFormInput
                    style={{ marginTop: '-0.6rem', fontWeight: '600' }}
                    id="detailCategory"
                    name="category"
                    size="sm"
                    placeholder=""
                    defaultValue={predefinedPromptDetail?.category}
                    readOnly={isReadMode}
                    plainText={isReadMode}
                    {...register('category', {
                      required: '카테고리를 작성 해 주세요.',
                      validate: (value) => value.trim().length > 0 || '공백만으로 카테고리를 작성할 수 없습니다.',
                    })}
                    invalid={!!errors.category}
                    feedbackInvalid={errors.category?.message}
                  />
                </CCol>
                <CCol
                  sm={5}
                  style={{
                    marginLeft: '2rem',
                    borderLeft: 'solid 3px',
                    borderColor: 'gray',
                    position: 'relative',
                  }}
                >
                  <CFormLabel
                    className="text-muted"
                    style={{ fontSize: '0.875rem', marginBottom: !isReadMode ? '1rem' : '-.2rem' }}
                    htmlFor="detailApprove"
                  >
                    승인 여부
                  </CFormLabel>
                  <PromptApprovalStatusBadge
                    approved={watch('approved')}
                    style={{
                      position: 'absolute',
                      top: '2rem',
                      left: '0.5rem',
                    }}
                  />
                  {!isReadMode && (
                    <CButton
                      style={{
                        position: 'absolute',
                        top: '0.8rem',
                        left: '6rem',
                      }}
                      size="sm"
                      onClick={() => {
                        setValue('approved', !watch('approved'));
                      }}
                      color={watch('approved') ? 'danger' : 'success'}
                    >
                      {watch('approved') ? '반려' : '승인'}
                    </CButton>
                  )}
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol>
                  <CFormTextarea
                    id="detailContent"
                    name="content"
                    rows={8}
                    placeholder="적용할 프롬프트를 작성 해 주세요."
                    defaultValue={predefinedPromptDetail?.content}
                    readOnly={isReadMode}
                    plainText={isReadMode}
                    {...register('content', {
                      required: '프롬프트를 작성 해 주세요.',
                      validate: (value) => value.trim().length > 0 || '공백만으로 프롬프트를 작성할 수 없습니다.',
                    })}
                    invalid={!!errors.content}
                    feedbackInvalid={errors.content?.message}
                    className="border-dark"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={predefinedPromptDetail.id}
          formModes={formModes(formMode)}
          handleCancel={handleModificationCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={() => setFormMode('update')}
          isCreatedByCurrentUser={predefinedPromptDetail?.createdBy === currentUserId}
          isDataDeleted={predefinedPromptDetail.deleted}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};
