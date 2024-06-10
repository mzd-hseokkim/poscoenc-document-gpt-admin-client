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
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import { useSearchForm } from 'hooks/useSearchForm';
import StandardContractService from 'services/document-collection/StandardContractService';
import { formatToYMD, getCurrentDate, getOneYearAgoDate } from 'utils/common/dateUtils';
import { columnSorterCustomProps, tableCustomProps } from 'utils/common/smartTablePropsConfig';
import { standardContractDocumentColumnConfig } from 'views/pages/document-collection/standard-contract/standardContractDocumentColumnConfig';

const createInitialSearchFormData = () => ({
  originalFilename: '', // 파일명
  displayName: '', // 표시명
  // description: '', 오류 관련
  // filePath: '', S3 서버의 경로가 될 것
  createdByName: '', // 게시자
  fromCreatedAt: getOneYearAgoDate(),
  toCreatedAt: getCurrentDate(),
  deletionOption: 'ALL', // 삭제 여부
});
const StandardContractDocumentManagementPage = () => {
  const [standardContractDocumentList, setStandardContractDocumentList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [searchFormData, setSearchFormData] = useState({});
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [totalCollectionElements, setTotalCollectionElements] = useState(0);
  const [detailFormMode, setDetailFormMode] = useState('');

  const modal = useModal();
  const { addToast } = useToast();
  const {
    isPickTime,
    stagedSearchFormData,
    handleDateChange,
    handleSearchFormChange,
    handleSearchFormReset,
    handleTimePickerCheck,
  } = useSearchForm(createInitialSearchFormData());

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalCollectionElements);
  const isComponentMounted = useRef(true);

  // search form logic start -------------------------
  const handleSubmitSearchRequest = (e) => {
    e.preventDefault();
    setSearchFormData(stagedSearchFormData);
    console.log(stagedSearchFormData);
  };

  const searchStandardContractDocument = useCallback(async () => {
    setSearchResultIsLoading(true);
    if (!isSearchPerformed) {
      setIsSearchPerformed(true);
    }
    try {
      const searchResult = await StandardContractService.getStandardContractDocumentList(searchFormData, pageableData);
      setStandardContractDocumentList(searchResult.content);
      setTotalCollectionElements(searchResult.totalElements);
    } catch (error) {
      //REMIND only sever error occur
      addToast('검색 결과를 가져 올 수 없습니다.');
      console.log(error);
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [addToast, isSearchPerformed, pageableData, searchFormData]);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchStandardContractDocument();
    }
  }, [pageableData, searchStandardContractDocument]);

  // search result list logic  start ----------------
  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const toggleDocumentCollectionDeleted = async (deletionOption) => {
    try {
      const isSuccess = await StandardContractService.patchStandardContractDocumentDeletionOption(
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
      await searchStandardContractDocument();
    }
  };

  const handleRowClick = (itemId) => {
    setDetailFormMode('read');
    modal.openModal(itemId);
  };

  const scopedColumns = {
    originalFilename: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        {item.originalFilename}
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
      <FormLoadingCover isLoading={false} />
      <CRow id="Standard Contract Document Search Form">
        <CCard className="row g-3">
          <CCardBody>
            <CForm onSubmit={handleSubmitSearchRequest}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="originalFilename"
                    floatingLabel="파일명"
                    placeholder=""
                    value={stagedSearchFormData.originalFilename}
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
                    key={`createdAt-${isPickTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={stagedSearchFormData.fromCreatedAt}
                    endDate={stagedSearchFormData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={2} className="mt-5">
                  <CFormCheck label="시간 검색 여부" checked={isPickTime} onChange={(e) => handleTimePickerCheck(e)} />
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
      <CRow id="Standard Contract Document Search Result List">
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
                  downloadFunction={StandardContractService.getDownloadSearchedStandardContractDocumentList}
                  searchFormData={searchFormData}
                  hasSearchResults={standardContractDocumentList.length !== 0}
                />
              </CCol>
              <CCol className="d-flex justify-content-end">
                <CFormLabel>총 {totalCollectionElements} 개의 검색 결과</CFormLabel>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={columnSorterCustomProps}
                columns={standardContractDocumentColumnConfig}
                items={standardContractDocumentList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 문서 집합 개수"
                itemsPerPageSelect
                loading={searchResultIsLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={standardContractDocumentList.length}
                    isSearchPerformed={isSearchPerformed}
                    defaultMessage="검색 조건에 맞는 표준 계약 문서를 검색합니다."
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
    </>
  );
};

export default StandardContractDocumentManagementPage;
