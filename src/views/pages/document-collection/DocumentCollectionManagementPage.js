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
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import DeletionStatusBadge from 'components/badge/DeletionStatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import DocumentCollectionDetailForm from 'components/document-collection/DocumentCollectionDetailForm';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import { useSearchForm } from 'hooks/useSearchForm';
import DocumentCollectionService from 'services/document-collection/DocumentCollectionService';
import { formatToYMD, getCurrentDate, getOneYearAgoDate } from 'utils/common/dateUtils';
import { CommonColumnSorterCustomProps, CommonTableCustomProps } from 'utils/common/smartTablePropsConfig';
import { documentCollectionColumnConfig } from 'views/pages/document-collection/documentCollectionColumnConfig';

const createInitialSearchFormData = () => ({
  name: '',
  displayName: '',
  createdByName: '',
  fromCreatedAt: getOneYearAgoDate(),
  toCreatedAt: getCurrentDate(),
  deletionOption: 'ALL',
});
const DocumentCollectionManagementPage = () => {
  const [documentCollectionList, setDocumentCollectionList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [detailFormMode, setDetailFormMode] = useState('read');
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [totalCollectionElements, setTotalCollectionElements] = useState(0);
  const [hasError, setHasError] = useState(false);

  const [searchFormData, setSearchFormData] = useState({});

  const isComponentMounted = useRef(true);
  const isSearchPerformed = useRef(false);

  const modal = useModal();
  const { addToast } = useToast();
  const {
    includeTimePicker,
    stagedSearchFormData,
    handleDateChange,
    handleSearchFormChange,
    handleSearchFormReset,
    handleTimePickerCheck,
  } = useSearchForm(createInitialSearchFormData());
  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } = usePagination(
    totalCollectionElements,
    'id,desc'
  );

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const searchDocumentCollectionList = useCallback(async () => {
    setSearchResultIsLoading(true);
    if (!isSearchPerformed.current) {
      isSearchPerformed.current = true;
    }
    try {
      const searchResult = await DocumentCollectionService.getSearchedCollectionList(searchFormData, pageableData);
      setDocumentCollectionList(searchResult.content);
      setTotalCollectionElements(searchResult.totalElements);
    } catch (error) {
      console.log(error);
      setHasError(true);
      addToast({ color: 'danger', message: `${error.response.data.message} with ${error.response.status}` });
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [addToast, pageableData, searchFormData]);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      if (!hasError) {
        void searchDocumentCollectionList();
      }
    }
  }, [hasError, pageableData, searchDocumentCollectionList]);
  const handleRowClick = (itemId) => {
    setDetailFormMode('read');
    modal.openModal(itemId);
  };

  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    setHasError(false);
    setSearchFormData(stagedSearchFormData);
  };

  const toggleDocumentCollectionDeleted = async (deletionOption) => {
    try {
      const isSuccess = await DocumentCollectionService.patchCollectionsDeletionOption(
        selectedRows.map((row) => row.id),
        deletionOption
      );

      if (isSuccess) {
        setSelectedRows([]);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '삭제할 문서 집합을 선택해주세요.' });
      } else if (status === 404) {
        addToast({ message: '삭제할 문서 집합을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    } finally {
      await searchDocumentCollectionList();
    }
  };

  const scopedColumns = {
    name: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        {item.name}
      </td>
    ),
    displayName: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        {item.displayName}
      </td>
    ),
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
    deleted: (item) => (
      <td>
        <DeletionStatusBadge deleted={item.deleted} />
      </td>
    ),
  };

  return (
    <>
      <CRow>
        <CCard className="row g-3">
          <CCardBody>
            <CForm onSubmit={handleSubmitSearchRequest}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="name"
                    floatingLabel="문서 집합 이름"
                    placeholder=""
                    value={stagedSearchFormData.name}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="displayName"
                    floatingLabel="표시명"
                    placeholder=""
                    value={stagedSearchFormData.displayName}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3 align-items-center">
                <CCol md={6} className="position-relative">
                  <CFormInput
                    id="createdByName"
                    floatingLabel="게시자"
                    placeholder=""
                    onChange={handleSearchFormChange}
                    value={stagedSearchFormData.createdByName}
                  />
                </CCol>
                <CCol md={6} style={{ paddingBottom: '10px' }}>
                  <CFormSelect
                    id="deletionOption"
                    label="삭제된 문서 포함"
                    name="deletionOption"
                    options={[
                      { label: '선택하지 않음', value: '' },
                      { label: '예', value: 'YES' },
                      { label: '아니오', value: 'NO' },
                    ]}
                    value={stagedSearchFormData.deletionOption}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CDateRangePicker
                    key={`createdAt-${includeTimePicker}`}
                    id="createdAt"
                    label="등록일"
                    startDate={stagedSearchFormData.fromCreatedAt}
                    endDate={stagedSearchFormData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                    timepicker={includeTimePicker}
                  />
                </CCol>
                <CCol md={2} className="mt-5">
                  <CFormCheck
                    label="시간 검색 여부"
                    checked={includeTimePicker}
                    onChange={(e) => handleTimePickerCheck(e)}
                  />
                </CCol>
              </CRow>
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
                <CButton
                  disabled={selectedRows?.length === 0 || isDeletedRow(selectedRows)}
                  onClick={() => toggleDocumentCollectionDeleted(true)}
                >
                  삭제
                </CButton>
                <CButton
                  disabled={selectedRows?.length === 0 || !isDeletedRow(selectedRows)}
                  onClick={() => toggleDocumentCollectionDeleted(false)}
                >
                  복구
                </CButton>
                <ExcelDownloadCButton
                  downloadFunction={DocumentCollectionService.getDownloadSearchedCollectionList}
                  searchFormData={searchFormData}
                  hasSearchResults={documentCollectionList.length !== 0}
                />
              </CCol>
              <CCol className="d-flex justify-content-end">
                <CFormLabel>총 {totalCollectionElements} 개의 검색 결과</CFormLabel>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={CommonColumnSorterCustomProps}
                columns={documentCollectionColumnConfig}
                items={documentCollectionList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 문서 집합 개수"
                itemsPerPageSelect
                loading={searchResultIsLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={documentCollectionList.length}
                    isSearchPerformed={isSearchPerformed.current}
                    defaultMessage="검색 조건에 맞는 문서 집합을 검색합니다."
                    isLoading={searchResultIsLoading}
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
      <ModalContainer visible={modal.isOpen} title={'문서 집합 상세'} onClose={modal.closeModal} size="lg">
        <DocumentCollectionDetailForm
          closeModal={modal.closeModal}
          initialFormMode={detailFormMode}
          refreshDocumentCollectionList={searchDocumentCollectionList}
        />
      </ModalContainer>
    </>
  );
};

export default DocumentCollectionManagementPage;
