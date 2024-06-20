import React, { useCallback, useEffect, useState } from 'react';

import { cilArrowThickToTop, cilSave } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormLabel,
  CFormTextarea,
  CListGroup,
  CListGroupItem,
  CModalBody,
  CModalFooter,
  CRow,
} from '@coreui/react-pro';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { AuditFields } from 'components/form/AuditFields';
import FormInputGrid from 'components/input/FormInputGrid';
import PdfViewer from 'components/pdf/PdfViewer';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { MdPictureAsPdf } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import DocumentCollectionService from 'services/document-collection/DocumentCollectionService';
import StandardContractService from 'services/document-collection/StandardContractService';
import { userIdSelector } from 'states/jwtTokenState';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';
import { itemNameValidationPattern } from 'utils/common/validationUtils';

export const StandardContractDocumentDetailForm = ({
  initialFormMode,
  closeModal,
  refreshStandardContractDocumentList,
}) => {
  const [standardContractDocumentDetail, setStandardContractDocumentDetail] = useState({});
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);

  const { addToast } = useToast();
  const { isReadMode } = formModes(formMode);
  const [searchParams] = useSearchParams();
  const currentUserId = useRecoilValue(userIdSelector);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const standardContractDocumentSpecificFields = [
    {
      name: 'displayName',
      label: '표시명',
      rules: {
        required: '표시명은 필수 입력 항목입니다.',
        pattern: {
          value: itemNameValidationPattern,
          message: '한글, 알파벳, 숫자, 띄어쓰기만 허용됩니다.',
        },
      },
    },
    {
      name: 'originalFilename',
      label: '파일명',
    },
  ];

  const fetchStandardContractDetail = useCallback(
    async (standardContractDocumentId) => {
      setGetDetailIsLoading(true);
      try {
        const detail = await StandardContractService.getStandardContractDocumentDetail(standardContractDocumentId);
        if (detail) {
          setStandardContractDocumentDetail(detail);

          const formattedDetail = {
            ...detail,
            createdAt: detail.createdAt && formatToYMD(detail.createdAt),
            modifiedAt: detail.modifiedAt && formatToYMD(detail.modifiedAt),
          };
          reset(formattedDetail);
        }
      } catch (error) {
        console.log(error);
        addToast({ message: '표준 계약서 정보를 가져오지 못했습니다.' });
      } finally {
        setGetDetailIsLoading(false);
      }
    },
    [reset, addToast]
  );

  useEffect(() => {
    const standardContractDocumentId = searchParams.get('id');
    if (!standardContractDocumentId) {
      closeModal();
    }

    void fetchStandardContractDetail(standardContractDocumentId);
    // void fetchStatisticsData(standardContractDocumentId); 통계데이터는 보류
  }, [closeModal, searchParams, fetchStandardContractDetail]);

  const onSubmit = async (data) => {
    await putModifiedDocument(data);
  };

  const putModifiedDocument = async (data) => {
    try {
      const isModified = await StandardContractService.putModifiedStandardContractDocumentDetail(data);
      if (isModified) {
        closeModal();
        setStandardContractDocumentDetail({});
        setFormMode('');
        refreshStandardContractDocumentList();
      }
    } catch (error) {
      const status = error.response?.status;
      console.log(error);
      if (status === 400) {
        addToast({ message: '본인이 게시한 문서 집합만 수정 가능합니다.' });
      } else if (status === 404) {
        addToast({ message: '수정할 문서 집합을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        addToast({ message: '문서를 수정하지 못했습니다.' });
      }
    }
  };
  const handleModificationCancelClick = async () => {
    setFormMode('read');
    await fetchStandardContractDetail(searchParams.get('id'));
  };
  const handleDeleteRestoreClick = async (standardContractDocumentId) => {
    const shouldDelete = !standardContractDocumentDetail.deleted;
    try {
      await DocumentCollectionService.patchCollectionsDeletionOption([standardContractDocumentId], shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    await fetchStandardContractDetail(standardContractDocumentId);
    refreshStandardContractDocumentList();
  };

  const handleDownload = async () => {
    try {
      await StandardContractService.getDownloadContractDocument(standardContractDocumentDetail);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        addToast({ message: '다운로드 할 파일을 찾지 못했습니다. 목록을 새로고침 해 주세요.' });
      } else {
        console.log(error);
        addToast({ message: '다운로드에 실패했습니다.' });
      }
    }
  };

  return (
    <>
      <FormLoadingCover isLoading={getDetailIsLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <AuditFields formMode={formMode} formData={standardContractDocumentDetail} isReadMode={isReadMode} />
          <CCard className="mb-3">
            <CCardBody>
              <FormInputGrid
                register={register}
                fields={standardContractDocumentSpecificFields}
                formData={standardContractDocumentDetail}
                isReadMode={isReadMode}
                errors={errors}
                col={1}
              />
              {standardContractDocumentDetail.description && (
                <>
                  <CFormLabel
                    htmlFor="detail-form-description"
                    className="fw-bold
                              border
                              border-start-0 border-top-0 border-end-0
                              border-opacity-50
                              border-bottom-2 border-info
                              "
                  >
                    문서 설명
                  </CFormLabel>
                  <CFormTextarea
                    id="detail-form-description"
                    name="description"
                    value={standardContractDocumentDetail.description}
                    plainText
                    readOnly
                  />
                </>
              )}
            </CCardBody>
          </CCard>
        </CForm>

        <CCard id="Standard Contract Document PDF viewer" className="mb-3">
          <CCardHeader>
            <CCol sm={5}>
              <h4 id="document-files" className="card-title mb-0">
                PDF Viewer
              </h4>
            </CCol>
          </CCardHeader>
          <CCardBody>
            <CListGroup>
              <CListGroupItem className="justify-content-between align-items-start">
                <CRow>
                  <CCol md={9} className="align-content-center">
                    <CCol className="d-flex">
                      <span style={{ marginRight: `10px` }}>{standardContractDocumentDetail.originalFilename}</span>
                    </CCol>
                  </CCol>
                  <CCol md={3} className="align-content-center">
                    <div className="float-end">
                      <CButton className="me-2" onClick={() => setPdfVisible((prev) => !prev)}>
                        {!pdfVisible ? (
                          <MdPictureAsPdf size="20" title="PDF Reader" />
                        ) : (
                          <CIcon icon={cilArrowThickToTop} size={'lg'} />
                        )}
                      </CButton>
                      <CButton onClick={() => handleDownload()}>
                        <CIcon icon={cilSave} size={'custom'} width={20} height={20} />
                      </CButton>
                    </div>
                  </CCol>
                  <CCollapse visible={pdfVisible || false}>
                    <PdfViewer
                      fileUrl={`admin/standard-contract-document/download/${standardContractDocumentDetail.id}`}
                      visible={pdfVisible || false}
                    ></PdfViewer>
                  </CCollapse>
                </CRow>
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={standardContractDocumentDetail.id}
          formModes={formModes(formMode)}
          handleCancel={handleModificationCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={() => setFormMode('update')}
          isCreatedByCurrentUser={standardContractDocumentDetail.createdBy === currentUserId}
          isDataDeleted={standardContractDocumentDetail.deleted}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};
