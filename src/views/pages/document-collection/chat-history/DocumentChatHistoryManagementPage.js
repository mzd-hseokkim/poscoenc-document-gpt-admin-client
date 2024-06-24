import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  CInputGroup,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import DocumentChatHistoryDetailForm from 'components/document-collection/DocumentChatHistoryDetailForm';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import { format } from 'date-fns';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import DocumentChatHistoryService from 'services/document-collection/DocumentChatHistoryService';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  formatToYMD,
  getCurrentDate,
  getOneYearAgoDate,
} from 'utils/common/dateUtils';
import { CommonColumnSorterCustomProps, CommonTableCustomProps } from 'utils/common/smartTablePropsConfig';
import { documentChatHistoryColumnConfig } from 'views/pages/document-collection/chat-history/documentChatHistoryColumnConfig';

const createInitialSearchFormData = () => ({
  answer: '',
  question: '',
  documentCollectionId: '',
  documentCollectionDisplayName: '',
  fromCreatedAt: getOneYearAgoDate(),
  toCreatedAt: getCurrentDate(),
  createdByName: '',
});

const DocumentChatHistoryManagementPage = () => {
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [detailFormMode, setDetailFormMode] = useState('');
  const [totalChatHistoryElements, setTotalChatHistoryElements] = useState(0);

  const [searchFormData, setSearchFormData] = useState({});
  const [stagedSearchFormData, setStagedSearchFormData] = useState(createInitialSearchFormData);
  const [isPickTime, setIsPickTime] = useState(false);

  const isComponentMounted = useRef(true);
  const modal = useModal();
  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalChatHistoryElements);

  const searchChatHistoryList = useCallback(async () => {
    setSearchResultIsLoading(true);
    if (!isSearchPerformed) {
      setIsSearchPerformed(true);
    }
    try {
      const searchResult = await DocumentChatHistoryService.getSearchedDocumentChatHistory(
        searchFormData,
        pageableData
      );
      if (searchResult) {
        setChatHistoryList(searchResult.content);
        setTotalChatHistoryElements(searchResult.totalElements);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [isSearchPerformed, pageableData, searchFormData]);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchChatHistoryList();
    }
  }, [searchChatHistoryList]);

  const handleRowClick = (itemId) => {
    setDetailFormMode('read');
    modal.openModal(itemId);
  };
  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    setSearchFormData(stagedSearchFormData);
  };
  const handleSearchFormReset = () => {
    setStagedSearchFormData(createInitialSearchFormData);
    setIsPickTime(false);
  };

  const handleSearchFormChange = ({ target: { id, value } }) => {
    setStagedSearchFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = ({ id, newDate, isStartDate = true }) => {
    //REMIND 시간날 때 함수 리팩토링, 모듈화
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
    };

    const fieldToUpdate = fieldMap[id];

    if (!fieldToUpdate) {
      return;
    }

    const newFormattedDate = newDate
      ? isPickTime
        ? formatToIsoEndDate(newDate)
        : format(new Date(newDate), "yyyy-MM-dd'T'23:59")
      : null;

    const formattedDate = isStartDate ? formatToIsoStartDate(newDate) : newFormattedDate;
    setStagedSearchFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
  };

  const handleTimePickerCheck = (e) => {
    setIsPickTime(e.target.checked);
    setStagedSearchFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(prev.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(prev.toCreatedAt, "yyyy-MM-dd'T'23:59"),
    }));
  };

  const scopedColumns = {
    documentCollectionId: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        {item.documentCollectionId}
      </td>
    ),
    answer: (item) => (
      <td
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        <div
          style={{
            maxWidth: `180px`,
            whiteSpace: `nowrap`,
            overflow: `hidden`,
            textOverflow: `ellipsis`,
          }}
        >
          {item.answer}
        </div>
      </td>
    ),
    question: (item) => (
      <td
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        <div
          style={{
            maxWidth: `200px`,
            whiteSpace: `nowrap`,
            overflow: `hidden`,
            textOverflow: `ellipsis`,
          }}
        >
          {item.question}
        </div>
      </td>
    ),
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
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
                    id="answer"
                    floatingLabel="답변"
                    placeholder=""
                    floatingClassName="mb-0"
                    value={stagedSearchFormData.answer}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="question"
                    floatingLabel="질문"
                    placeholder=""
                    value={stagedSearchFormData.question}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="documentCollectionId"
                    floatingLabel="문서 집합 아이디"
                    placeholder=""
                    value={stagedSearchFormData.documentCollectionId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="documentCollectionDisplayName"
                    floatingLabel="문서 집합 표시명"
                    placeholder=""
                    value={stagedSearchFormData.documentCollectionDisplayName}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6} className="position-relative">
                  <CFormInput
                    id="createdByName"
                    floatingLabel="질문한 사람"
                    placeholder=""
                    onChange={handleSearchFormChange}
                    value={stagedSearchFormData.createdByName}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CInputGroup>
                    <CButton className="col-2" color="white">
                      등록일
                    </CButton>
                    <CDateRangePicker
                      key={`createdAt-${isPickTime}`}
                      id="createdAt"
                      className="col-10"
                      startDate={stagedSearchFormData.fromCreatedAt}
                      endDate={stagedSearchFormData.toCreatedAt}
                      onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                      onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                      timepicker={isPickTime}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CCol md={2} className="justify-content-end">
                <CFormCheck
                  id="timepicker"
                  label="시간 검색 여부"
                  className="mt-2"
                  checked={isPickTime}
                  onChange={(e) => handleTimePickerCheck(e)}
                />
              </CCol>

              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton color="primary" value="Reset" onClick={handleSearchFormReset}>
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
          <CCardBody>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-start">
                <ExcelDownloadCButton
                  downloadFunction={DocumentChatHistoryService.getDownloadSearchedChatHistoryList}
                  searchFormData={searchFormData}
                  hasSearchResults={chatHistoryList.length !== 0}
                />
              </CCol>
              <CCol className="d-flex justify-content-end">
                <CFormLabel>총 {totalChatHistoryElements} 개의 검색 결과</CFormLabel>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={CommonColumnSorterCustomProps}
                columns={documentChatHistoryColumnConfig}
                items={chatHistoryList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 대화 이력 개수"
                itemsPerPageSelect
                loading={searchResultIsLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={chatHistoryList?.length}
                    isSearchPerformed={isSearchPerformed}
                    defaultMessage="검색 조건에 맞는 한 쌍의 질문-답변을 검색합니다."
                  />
                }
                onItemsPerPageChange={handlePageSizeChange}
                onSelectedItemsChange={setSelectedRows}
                onSorterChange={handlePageSortChange}
                paginationProps={smartPaginationProps}
                scopedColumns={scopedColumns}
                selectable
                selected={selectedRows}
                tableProps={CommonTableCustomProps}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
      <ModalContainer visible={modal.isOpen} title={'채팅 이력'} onClose={modal.closeModal} size="lg">
        <DocumentChatHistoryDetailForm
          closeModal={modal.closeModal}
          initialFormMode={detailFormMode}
          refreshDocumentCollectionList={searchChatHistoryList}
        />
      </ModalContainer>
    </>
  );
};

export default DocumentChatHistoryManagementPage;
