import React, { useCallback, useEffect, useState } from 'react';

import { cilArrowThickToBottom, cilCloudDownload } from '@coreui/icons';
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
import DocumentFileStatusBadge from 'components/badge/DocumentFileStatusBadge';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import { mergeAndSumArrays, padDataArrayWithZero } from 'components/chart/utils/ChartStatisticsProcessor';
import { TokenUsageChart } from 'components/chart/TokenUsageChart';
import { getFirstAndLastMonthLabels } from 'components/chart/utils/chartPastYearMonthsLabels';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FormInputGrid from 'components/input/FormInputGrid';
import PdfViewer from 'components/pdf/PdfViewer';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { MdPictureAsPdf } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import DocumentCollectionFileService from 'services/document-collection/DocumentCollectionFileService';
import DocumentCollectionService from 'services/document-collection/DocumentCollectionService';
import StatisticsService from 'services/statistics/StatisticsService';
import { userIdSelector } from 'states/jwtTokenState';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import { formatFileSize } from 'utils/common/formatFileSize';
import formModes from 'utils/common/formModes';
import MonthLabelGenerator from 'utils/common/MonthLabelGenerator';
import { itemNameValidationPattern } from 'utils/common/validationUtils';

const DocumentCollectionDetailForm = ({ initialFormMode, closeModal, refreshDocumentCollectionList }) => {
  const [collectionDetail, setCollectionDetail] = useState({});
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);
  const [statisticsData, setStatisticsData] = useState({
    inputTokenData: [],
    outputTokenData: [],
    bingSearchsData: [],
    dallE3GenerationsData: [],
  });
  const [searchParams] = useSearchParams();

  const { addToast } = useToast();
  const currentUserId = useRecoilValue(userIdSelector);
  const { isReadMode, isUpdateMode } = formModes(formMode);
  const chartLabels = MonthLabelGenerator.pastYearMonthsChartLabels();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const collectionSpecificFields = [
    {
      name: 'id',
      label: '아이디',
      isDisabled: isUpdateMode,
    },
    {
      name: 'name',
      label: '문서 집합 이름',
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
      rules: {
        required: '표시명은 필수 입력 항목입니다.',
        pattern: {
          value: itemNameValidationPattern,
          message: '한글, 알파벳, 숫자, 띄어쓰기만 허용됩니다.',
        },
      },
    },
    {
      name: 'status',
      label: '문서 상태',
      badge: 'DocumentFileStatusBadge',
    },
  ];

  const fetchCollectionDetail = useCallback(
    async (collectionId) => {
      if (!collectionId) {
        return;
      }
      setGetDetailIsLoading(true);
      try {
        const detail = await DocumentCollectionService.getCollectionDetail(collectionId);
        setCollectionDetail(detail);
        const formattedDetail = {
          ...detail,
          createdAt: detail.createdAt && formatToYMD(detail.createdAt),
          modifiedAt: detail.modifiedAt && formatToYMD(detail.modifiedAt),
        };
        reset(formattedDetail);
      } catch (error) {
        if (error.response?.status === 404) {
          addToast({ message: `id={${collectionId}} 해당 문서 집합을 찾을 수 없습니다.` });
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

  const fetchStatisticsData = useCallback(async (collectionId) => {
    try {
      const responseData = await StatisticsService.getMonthlyStatisticsData({
        criteria: 'documentCollection',
        criteriaKey: collectionId,
        endDate: new Date().toISOString().split('T')[0],
      });
      responseData.list.sort((a, b) => {
        const [yearA, monthA] = a.aggregationKey.split('-').map(Number);
        const [yearB, monthB] = b.aggregationKey.split('-').map(Number);

        if (yearA !== yearB) {
          return yearA - yearB;
        } else {
          return monthA - monthB;
        }
      });
      setStatisticsData({
        inputTokenData: responseData.list.map((item) => item.sumInputTokens),
        outputTokenData: responseData.list.map((item) => item.sumOutputTokens),
        bingSearchsData: responseData.list.map((item) => item.sumBingSearchs),
        dallE3GenerationsData: responseData.list.map((item) => item.sumDallE3Generations),
      });
    } catch (error) {
      console.log(error);
    } finally {
      //REMIND Loading cover
    }
  }, []);

  useEffect(() => {
    const collectionId = searchParams.get('id');
    if (!collectionId) {
      closeModal();
    }
    void fetchCollectionDetail(collectionId);
    void fetchStatisticsData(collectionId);
  }, [closeModal, fetchCollectionDetail, fetchStatisticsData, searchParams]);
  const putModifiedCollection = async (data) => {
    try {
      const isModified = await DocumentCollectionService.putModifiedCollectionDetail(data);
      if (isModified) {
        closeModal();
        setCollectionDetail({});
        setFormMode('');
        refreshDocumentCollectionList();
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

  const handleModificationCancelClick = async () => {
    setFormMode('read');
    await fetchCollectionDetail();
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

  // PDF--------------
  const [visible, setVisible] = useState({});
  const toggleVisible = (fileId) => {
    setVisible((prevState) => ({
      ...prevState,
      [fileId]: !prevState[fileId],
    }));
  };

  //--------------
  const renderChart = () => {
    return (
      <>
        <CCard className="mb-3">
          <CCardHeader>
            <CRow>
              <CCol sm={5}>
                <h4 id="usage-statistics" className="card-title mb-0">
                  사용 통계
                </h4>
                <div className="small text-medium-emphasis">
                  {firstLabel} - {`${new Date().getFullYear()} / ${lastLabel}`}
                </div>
              </CCol>
              <CCol sm={7} className="d-none d-md-block">
                <CButton color="primary" className="float-end">
                  <CIcon icon={cilCloudDownload} />
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3 justify-content-center">
              <TokenUsageChart
                outputTokenData={statisticsData.outputTokenData}
                inputTokenData={statisticsData.inputTokenData}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </>
    );
  };

  return (
    <>
      <FormLoadingCover isLoading={getDetailIsLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CCard className="mb-3">
            <CCardBody>
              <FormInputGrid
                register={register}
                fields={getAuditFields(formMode)}
                formData={collectionDetail}
                isReadMode={isReadMode}
                col={2}
              />
            </CCardBody>
          </CCard>
          <CCard className="mb-3">
            <CCardBody>
              <FormInputGrid
                register={register}
                fields={collectionSpecificFields}
                formData={collectionDetail}
                isReadMode={isReadMode}
                errors={errors}
                col={2}
              />
              {collectionDetail.description && (
                <>
                  <CFormLabel
                    htmlFor="detail-form-description"
                    className="col-form-label fw-bold"
                    style={{ color: 'red' }}
                  >
                    에러 로그
                  </CFormLabel>
                  <CFormTextarea
                    {...register('description')}
                    id="detail-form-description"
                    name="description"
                    placeholder={isReadMode ? '' : '문서 설명을 작성해주세요.'}
                    plainText={isReadMode}
                    readOnly={isReadMode}
                  />
                </>
              )}
            </CCardBody>
          </CCard>
          {collectionDetail?.files?.length !== 0 && (
            <CCard className="mb-3">
              <CCardHeader>
                <CCol sm={5}>
                  <h4 id="document-files" className="card-title mb-0">
                    문서 목록
                  </h4>
                  <small className="text-medium-emphasis">{`총 ${collectionDetail?.files?.length || 0} 개 문서`}</small>
                </CCol>
              </CCardHeader>
              <CCardBody>
                <CListGroup>
                  {/*REMIND detail 에서 file 만 따로 처리 할 수 있도록 리팩토링, reset 에 의해 나머지 데이터가 관리되고 있음*/}
                  {collectionDetail?.files?.map((file, index) => (
                    <>
                      <CListGroupItem key={file.id} className="justify-content-between align-items-start">
                        <CRow>
                          <CCol md={9} className="align-content-center">
                            <CCol className="d-flex">
                              <span style={{ marginRight: `10px` }}>{file.originalName}</span>
                              <small>{formatFileSize(file.size)}</small>
                              <small style={{ marginLeft: `10px` }}>
                                <DocumentFileStatusBadge status={file.status} />
                              </small>
                            </CCol>
                            {file.description && (
                              <CCol>
                                <small className="text-muted">{`상태 설명 : ${file.description}`}</small>
                              </CCol>
                            )}
                          </CCol>
                          <CCol md={3} className="align-content-center">
                            <div className="float-end">
                              <CButton className="me-2" onClick={() => toggleVisible(file.id)}>
                                <MdPictureAsPdf size="20" title="PDF Reader" />
                              </CButton>
                              <CButton onClick={() => handleDownload(file)}>
                                <CIcon icon={cilArrowThickToBottom} size={'lg'} />
                              </CButton>
                            </div>
                          </CCol>
                          <CCollapse visible={visible[file.id] || false}>
                            <PdfViewer file={file} visible={visible[file.id] || false}></PdfViewer>
                          </CCollapse>
                        </CRow>
                      </CListGroupItem>
                    </>
                  ))}
                </CListGroup>
              </CCardBody>
            </CCard>
          )}
        </CForm>
        {renderChart()}
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={collectionDetail.id}
          formModes={formModes(formMode)}
          handleCancel={handleModificationCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={() => setFormMode('update')}
          isCreatedByCurrentUser={collectionDetail.createdBy === currentUserId}
          isDataDeleted={collectionDetail.deleted}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};

export default DocumentCollectionDetailForm;
