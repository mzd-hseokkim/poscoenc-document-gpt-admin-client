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
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import DocumentChatHistoryDetailForm from 'components/document-collection/DocumentChatHistoryDetailForm';
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
import { documentChatHistoryColumnConfig } from 'utils/document-collection/documentChatHistoryColumnConfig';

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

  const searchChatHistoryList = useCallback(async () => {
    setSearchResultIsLoading(true);
    try {
      const searchResult = await DocumentChatHistoryService.getSearchedDocumentChatHistory(
        searchFormData,
        pageableData
      );
      if (searchResult) {
        setChatHistoryList(searchResult.content);
        setTotalChatHistoryElements(searchResult.totalElements);
      }

      if (searchResult?.content?.length === 0 && noItemsLabel === '') {
        setNoItemsLabel('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [pageableData, searchFormData]);
  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchChatHistoryList();
    }
  }, [pageableData, searchChatHistoryList]);

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const toggleChatHistoryDeleted = async (deletionOption) => {
    try {
      const isSuccess = await DocumentChatHistoryService.patchChatHisotryDeletionOption(
        selectedRows.map((row) => row.id),
        deletionOption
      );

      if (isSuccess) {
        setSelectedRows([]);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '삭제할 채팅 이력을 선택해주세요.' });
      } else if (status === 404) {
        addToast({ message: '삭제할 채팅 이력을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    } finally {
      await searchChatHistoryList();
    }
  };

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
            maxWidth: `180px`, // 적절한 최대 너비 설정
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
            maxWidth: `200px`, // 적절한 최대 너비 설정
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
    deleted: (item) => (
      <td>
        <StatusBadge deleted={item.deleted} />
      </td>
    ),
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
                    value={searchFormData.chunkSeq}
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
                <CCol md={4}>
                  <CFormInput
                    id="documentCollectionId"
                    label="문서 집합 아이디"
                    value={searchFormData.documentCollectionId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    id="documentCollectionName"
                    label="문서 집합 이름"
                    value={searchFormData.documentCollectionFileNameOrg}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    id="documentCollectionDisplayName"
                    label="문서 집합 표시명"
                    value={searchFormData.documentCollectionFileNameOrg}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={3}>
                  <CFormInput
                    id="documentCollectionChunkId"
                    label="문서 집합의 청크 아이디"
                    value={searchFormData.documentCollectionFileId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={9}>
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
          <CCardBody>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-start">
                <CButton
                  disabled={selectedRows?.length === 0 || isDeletedRow(selectedRows)}
                  onClick={() => toggleChatHistoryDeleted(true)}
                >
                  {'삭제'}
                </CButton>
                <CButton
                  disabled={selectedRows?.length === 0 || !isDeletedRow(selectedRows)}
                  onClick={() => toggleChatHistoryDeleted(false)}
                >
                  {'복구'}
                </CButton>
                <ExcelDownloadCButton
                  downloadFunction={DocumentChatHistoryService.getDownloadSearchedCollectionList}
                  searchFormData={searchFormData}
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
                noItemsLabel={noItemsLabel}
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
