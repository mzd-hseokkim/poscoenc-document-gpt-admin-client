import React, { useEffect, useState } from 'react';

import { CButton, CCard, CCardBody, CCol, CForm, CListGroup, CListGroupItem, CRow } from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import HorizontalCFormInputList from 'components/input/HorizontalCFormInputList';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import DocumentCollectionFileService from 'services/document-collection/DocumentCollectionFileService';
import DocumentCollectionService from 'services/document-collection/DocumentCollectionService';
import { userIdSelector } from 'states/jwtTokenState';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import { formatFileSize } from 'utils/common/formatFileSize';
import formModes from 'utils/formModes';
import { itemNameValidationPattern } from 'utils/validationUtils';

const DocumentCollectionDetailForm = ({ clickedRowId, initialFormMode, closeModal, refreshDocumentCollectionList }) => {
  const [collectionDetail, setCollectionDetail] = useState({});
  const [formMode, setFormMode] = useState(initialFormMode || '');

  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);

  const { addToast } = useToast();
  const currentUserId = useRecoilValue(userIdSelector);
  const { isReadMode, isUpdateMode } = formModes(formMode);

  const { register, reset, handleSubmit } = useForm({ mode: 'onChange' });

  const collectionSpecificFields = [
    {
      md: 2,
      name: 'id',
      label: '아이디',
      isDisabled: isUpdateMode,
    },
    {
      name: 'name',
      label: '문서 집합 이름',
      placeholder: '문서 집합의 이름을 설정해주세요.',
      rules: {
        required: '문서 집합 이름은 필수 입력 항목입니다.',
        pattern: {
          value: itemNameValidationPattern,
          message: '한글, 알파벳, 숫자, 띄어쓰기만 허용됩니다.',
        },
      },
    },
    {
      name: 'displayName',
      label: '표시명',
      placeholder: '표시명을 입력해주세요.',
      rules: {
        required: '표시명은 필수 입력 항목입니다.',
        pattern: {
          value: itemNameValidationPattern,
          message: '한글, 알파벳, 숫자, 띄어쓰기만 허용됩니다.',
        },
      },
    },
    {
      md: 2,
      name: 'deleted',
      label: '삭제 여부',
    },
  ];

  useEffect(() => {
    fetchCollectionDetail();
  }, [clickedRowId]);

  const fetchCollectionDetail = async () => {
    if (!clickedRowId) {
      return;
    }
    setGetDetailIsLoading(true);
    try {
      const detail = await DocumentCollectionService.getCollectionDetail(clickedRowId);
      setCollectionDetail(detail);
      const formattedDetail = {
        ...detail,
        createdAt: detail.createdAt && formatToYMD(detail.createdAt),
        modifiedAt: detail.modifiedAt && formatToYMD(detail.modifiedAt),
      };
      reset(formattedDetail);
    } catch (error) {
      if (error.response?.status === 404) {
        addToast({ message: '해당 문서 집합을 찾을 수 없습니다.' });
      } else {
        console.log(error);
      }
    } finally {
      setGetDetailIsLoading(false);
    }
  };
  const putModifiedCollection = async (data) => {
    try {
      const isModified = await DocumentCollectionService.putModifiedCollectionDetail(data);
      if (isModified) {
        closeModal();
        refreshDocumentCollectionList();
        await fetchCollectionDetail();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '본인이 게시한 문서 집합만 수정 가능합니다.' });
      } else if (status === 404) {
        addToast({ message: '수정할 문서 집합을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    }
    //REMIND loading spinner
  };
  const onSubmit = async (data) => {
    await putModifiedCollection(data);
  };

  const handleDownload = async (file) => {
    try {
      await DocumentCollectionFileService.getDownloadDocument(file);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        addToast({ message: '다운로드 할 파일을 찾지 못했습니다. 목록을 새로고침 해 주세요.' });
      } else {
        console.log(error);
      }
    }
  };
  const handleBatchDownload = async (file) => {
    //TODO imple batch download
  };
  const handleDeleteRestoreClick = async (collectionId) => {
    const shouldDelete = !collectionDetail.deleted;
    try {
      await DocumentCollectionService.patchCollectionsDeletionOption([collectionId], shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    await fetchCollectionDetail();
    refreshDocumentCollectionList();
  };

  const renderFormActions = () => (
    <>
      <CRow className="row mt-3 justify-content-end">
        <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
          {isReadMode ? (
            <>
              {collectionDetail?.createdBy === currentUserId && (
                <CButton type="button" disabled={!isReadMode} onClick={() => setFormMode('update')}>
                  수정
                </CButton>
              )}
            </>
          ) : (
            <CButton type="button" onClick={handleSubmit(onSubmit)}>
              저장
            </CButton>
          )}
          <CButton onClick={() => handleDeleteRestoreClick(collectionDetail.id)}>
            {collectionDetail.deleted ? '복구' : '삭제'}
          </CButton>
        </CCol>
      </CRow>
    </>
  );

  return (
    <>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard className="mb-3">
          <CCardBody>
            <HorizontalCFormInputList
              register={register}
              fields={collectionSpecificFields}
              formData={collectionDetail}
              isReadMode={isReadMode}
            ></HorizontalCFormInputList>
            <HorizontalCFormInputList
              register={register}
              fields={getAuditFields(formMode)}
              formData={collectionDetail}
              isReadMode={isReadMode}
            />
            {renderFormActions()}
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
            <CListGroup>
              {collectionDetail?.files?.map((file, index) => (
                <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-end">
                    <span style={{ marginRight: `10px` }}>{file.originalName}</span>
                    <small>{formatFileSize(file.size)}</small>
                  </div>
                  <CButton onClick={() => handleDownload(file)}>다운로드</CButton>
                </CListGroupItem>
              ))}
            </CListGroup>
            {collectionDetail?.files?.length > 1 && (
              <CRow>
                <CCol className="d-flex justify-content-end">
                  <CButton className="mt-3" onClick={handleBatchDownload}>
                    일괄 다운로드
                  </CButton>
                </CCol>
              </CRow>
            )}
          </CCardBody>
        </CCard>
        <FormLoadingCover isLoading={getDetailIsLoading} />
      </CForm>
    </>
  );
};

export default DocumentCollectionDetailForm;
