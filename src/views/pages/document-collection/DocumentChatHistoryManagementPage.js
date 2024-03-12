import React, { useRef, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDateRangePicker,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import DocumentCollectionDetailForm from 'components/document-collection/DocumentCollectionDetailForm';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
import { format } from 'date-fns';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import { formatToIsoEndDate, formatToIsoStartDate, getCurrentDate, getOneYearAgoDate } from 'utils/common/dateUtils';

const DocumentChatHistoryManagementPage = () => {
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [detailFormMode, setDetailFormMode] = useState('');
  const [noItemsLabel, setNoItemsLabel] = useState('');
  const [totalChatHistoryElements, setTotalChatHistoryElements] = useState(0);
  const [isPickTime, setIsPickTime] = useState(false);

  const initialSearchFormData = {
    question: '',
    answer: '',
    documentCollectionId: '',
    documentCollectionChunkId: '',
    documentCollectionDisplayName: '',
    documentCollectionName: '',
    chunkedText: '',
    fromCreatedAt: getOneYearAgoDate(),
    toCreatedAt: getCurrentDate(),
    createdByName: '',
  };

  const [searchFormData, setSearchFormData] = useState(initialSearchFormData);
  const isComponentMounted = useRef(true);
  const { addToast } = useToast();
  const modal = useModal();

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalChatHistoryElements);
  const searchChatHistoryList = async () => {};
  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    await searchChatHistoryList();
  };
  const handleSearchFormChange = ({ target: { id, value } }) => {
    setSearchFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleDateChange = ({ id, newDate, isStartDate = true }) => {
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
    };
    const fieldToUpdate = fieldMap[id];
    if (fieldToUpdate) {
      const formattedDate = isStartDate ? formatToIsoStartDate(newDate) : formatToIsoEndDate(newDate);
      setSearchFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
    }
  };

  const handleTimePickerCheck = (e) => {
    setIsPickTime(e.target.checked);
    if (searchFormData.fromCreatedAt == null || searchFormData.toCreatedAt == null) {
      return;
    }
    setSearchFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(searchFormData.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(searchFormData.toCreatedAt, "yyyy-MM-dd'T'23:59"),
    }));
  };
  return (
    <>
      <FormLoadingCover isLoading={searchResultIsLoading} />
      <CRow>
        <CCard className="row g-3">
          <CCardBody>
            <CForm onSubmit={handleSubmitSearchRequest}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="question"
                    label="질문"
                    value={searchFormData.question}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="answer"
                    label="대답"
                    value={searchFormData.chunkSeq}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={3}>
                  <CFormInput
                    id="documentCollectionId"
                    label="문서 집합 아이디"
                    value={searchFormData.documentCollectionId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    id="documentCollectionChunkId"
                    label="문서 집합의 청크 아이디"
                    value={searchFormData.documentCollectionFileId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    id="documentCollectionDisplayName"
                    label="문서 집합 표시명"
                    value={searchFormData.documentCollectionFileNameOrg}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    id="chunkedText"
                    label="청크 내용"
                    value={searchFormData.pageId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={3} className="position-relative">
                  <CFormInput
                    id="createdByName"
                    label="게시자"
                    onChange={handleSearchFormChange}
                    value={searchFormData.createdByName}
                  />
                </CCol>
                <CCol md={6}>
                  <CDateRangePicker
                    key={`createdAt-${isPickTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={searchFormData.fromCreatedAt}
                    endDate={searchFormData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={3} className="mt-3">
                  <CFormLabel />
                  <CFormCheck label="시간 검색 여부" checked={isPickTime} onChange={(e) => handleTimePickerCheck(e)} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton color="primary" value="Reset" onClick={() => setSearchFormData(initialSearchFormData)}>
                    초기화
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CRow>
      <CRow>
        <CCard className="row g-3">
          <CCardBody></CCardBody>
        </CCard>
      </CRow>
      <ModalContainer visible={modal.isOpen} title={'문서 집합 상세'} onClose={modal.closeModal} size="lg">
        <DocumentCollectionDetailForm
          closeModal={modal.closeModal}
          initialFormMode={detailFormMode}
          refreshDocumentCollectionList={searchChatHistoryList}
        />
      </ModalContainer>
    </>
  );
};

export default DocumentChatHistoryManagementPage;
