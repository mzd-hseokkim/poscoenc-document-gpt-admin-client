import React, { useEffect, useRef, useState } from 'react';

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
  CSmartTable,
} from '@coreui/react-pro';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import DocumentChatHistoryDetailForm from 'components/document-collection/DocumentChatHistoryDetailForm';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
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
import { columnSorterCustomProps, tableCustomProps } from 'utils/common/smartTablePropsConfig';
import { documentChatHistoryColumnConfig } from 'views/pages/document-collection/documentChatHistoryColumnConfig';

const DocumentChatHistoryManagementPage = () => {
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [detailFormMode, setDetailFormMode] = useState('');
  const [totalChatHistoryElements, setTotalChatHistoryElements] = useState(0);

  const initialSearchFormData = {
    answer: '',
    question: '',
    documentCollectionId: '',
    documentCollectionDisplayName: '',
    fromCreatedAt: getOneYearAgoDate(),
    toCreatedAt: getCurrentDate(),
    createdByName: '',
    isPickTime: false,
  };

  const [searchFormData, setSearchFormData] = useState(initialSearchFormData);
  const isComponentMounted = useRef(true);
  const { addToast } = useToast();
  const modal = useModal();
  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalChatHistoryElements);

  const searchChatHistoryList = async () => {
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
  };

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchChatHistoryList();
    }
  }, [pageableData]);

  const handleRowClick = (itemId) => {
    setDetailFormMode('read');
    modal.openModal(itemId);
  };
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
    const isChecked = e.target.checked;

    setSearchFormData((prev) => {
      const updatedForm = { ...prev, isPickTime: isChecked };

      if (prev.fromCreatedAt != null && prev.toCreatedAt != null) {
        updatedForm.fromCreatedAt = format(prev.fromCreatedAt, "yyyy-MM-dd'T'00:00");
        updatedForm.toCreatedAt = format(prev.toCreatedAt, "yyyy-MM-dd'T'23:59");
      }

      return updatedForm;
    });
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
                    label="답변"
                    value={searchFormData.answer}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="question"
                    label="질문"
                    value={searchFormData.question}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    id="documentCollectionId"
                    label="문서 집합 아이디"
                    value={searchFormData.documentCollectionId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="documentCollectionDisplayName"
                    label="문서 집합 표시명"
                    value={searchFormData.documentCollectionDisplayName}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6} className="position-relative">
                  <CFormInput
                    id="createdByName"
                    label="질문한 사람"
                    onChange={handleSearchFormChange}
                    value={searchFormData.createdByName}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CDateRangePicker
                    key={`createdAt-${searchFormData.isPickTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={searchFormData.fromCreatedAt}
                    endDate={searchFormData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                    timepicker={searchFormData.isPickTime}
                  />
                </CCol>
                <CCol md={3} className="mt-3">
                  <CFormLabel />
                  <CFormCheck
                    id="timepicker"
                    label="시간 검색 여부"
                    checked={searchFormData.isPickTime}
                    onChange={(e) => handleTimePickerCheck(e)}
                  />
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
          <CCardBody>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-start">
                <ExcelDownloadCButton
                  downloadFunction={DocumentChatHistoryService.getDownloadSearchedChatHistoryList}
                  searchFormData={searchFormData}
                  hasSearchResults={chatHistoryList.length !== 0}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={columnSorterCustomProps}
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
                tableProps={tableCustomProps}
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
