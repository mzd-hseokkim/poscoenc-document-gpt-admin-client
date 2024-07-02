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
  CPopover,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import DeletionStatusBadge from 'components/badge/DeletionStatusBadge';
import PromptApprovalStatusBadge from 'components/badge/PromptApprovalStatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import { PredefinedPromptDetailForm } from 'components/predefined-prompt/PredefinedPromptDetailForm';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import { useSearchForm } from 'hooks/useSearchForm';
import PredefinedPromptService from 'services/predefined-prompt/PredefinedPromptService';
import { formatToYMD, getCurrentDate, getOneYearAgoDate } from 'utils/common/dateUtils';
import { CommonColumnSorterCustomProps, CommonTableCustomProps } from 'utils/common/smartTablePropsConfig';
import { predefinedPromptColumnConfig } from 'views/pages/predefined-prompt/predefinedPromptColumnConfig';

const createInitialSearchFormData = () => ({
  name: '', // 프롬프트 이름
  description: '', // 프롬프트에 대한 설명
  content: '', // 실제 프롬프트 내용
  category: '',
  approvalOption: 'ALL', // 승인 여부
  createdByName: '',
  fromCreatedAt: getOneYearAgoDate(),
  toCreatedAt: getCurrentDate(),
  deletionOption: 'ALL',
});
const PredefinedPromptManagementPage = () => {
  const [promptList, setPromptList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchFormData, setSearchFormData] = useState({});
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [totalPromptElements, setTotalPromptElements] = useState(0);
  const [detailFormMode, setDetailFormMode] = useState('');
  const [hasError, setHasError] = useState(false);

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
    totalPromptElements,
    'id,desc'
  );
  const isComponentMounted = useRef(true);
  const isSearchPerformed = useRef(false);

  const searchPredefinedPrompt = useCallback(async () => {
    setSearchResultIsLoading(true);
    if (!isSearchPerformed.current) {
      isSearchPerformed.current = true;
    }
    try {
      const searchResult = await PredefinedPromptService.getPredefinedPromptList(searchFormData, pageableData);
      setPromptList(searchResult.content);
      setTotalPromptElements(searchResult.totalElements);
      setHasError(false);
    } catch (error) {
      console.log(error);
      setHasError(true);
      addToast({ message: `프롬프트 검색 실패, ${error.response?.data?.message} ${error.response?.status}` });
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [addToast, isSearchPerformed, pageableData, searchFormData]);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      if (!hasError) {
        void searchPredefinedPrompt();
      }
    }
  }, [pageableData, searchPredefinedPrompt, hasError]);
  const handleSubmitSearchRequest = (e) => {
    e.preventDefault();
    setHasError(false); //reset error state for re-request
    setSearchFormData(stagedSearchFormData);
  };
  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const togglePromptDeleted = async (deletionOption) => {
    try {
      const isSuccess = await PredefinedPromptService.patchPredefinedPromptDeletionOption(
        selectedRows.map((row) => row.id),
        deletionOption
      );

      if (isSuccess) {
        setSelectedRows([]);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '삭제할 프롬프트를 선택해주세요.' });
      } else if (status === 404) {
        addToast({ message: '삭제할 프롬프트를 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    } finally {
      await searchPredefinedPrompt();
    }
  };

  const handleCreateClick = () => {
    setDetailFormMode('create');
    modal.openModal();
  };
  const handleTableRowClick = (itemId) => {
    setDetailFormMode('read');
    modal.openModal(itemId);
  };

  const scopedColumns = {
    name: (item) => (
      <td
        className="text-truncate"
        style={{ cursor: 'pointer', maxWidth: '300px' }}
        onClick={() => handleTableRowClick(item.id)}
      >
        {item.name}
      </td>
    ),
    description: (item) => (
      <td style={{ cursor: 'pointer' }} onClick={() => handleTableRowClick(item.id)}>
        <CPopover title={'설명'} content={item.description} trigger="hover" delay={500}>
          <div className="text-truncate" style={{ maxWidth: '240px' }}>
            {item.description}
          </div>
        </CPopover>
      </td>
    ),
    approved: (item) => (
      <td>
        <PromptApprovalStatusBadge approved={item.approved} />
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
      <FormLoadingCover isLoading={searchResultIsLoading} />
      <CRow id="PromptSearchForm">
        <CCard className="row g-3">
          <CCardBody>
            <CForm onSubmit={handleSubmitSearchRequest}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="name"
                    floatingLabel="프롬프트 명"
                    placeholder=""
                    value={stagedSearchFormData.name}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="description"
                    floatingLabel="설명"
                    placeholder=""
                    value={stagedSearchFormData.description}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="category"
                    floatingLabel="카테고리"
                    placeholder=""
                    value={stagedSearchFormData.category}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="createdByName"
                    floatingLabel="게시자"
                    placeholder=""
                    onChange={handleSearchFormChange}
                    value={stagedSearchFormData.createdByName}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="content"
                    floatingLabel="내용"
                    placeholder=""
                    value={stagedSearchFormData.content}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3 align-items-center">
                <CCol md={6} style={{ paddingBottom: '10px' }}>
                  <CFormSelect
                    id="approvalOption"
                    label="승인 여부"
                    name="approvalOption"
                    options={[
                      { label: '선택하지 않음', value: '' },
                      { label: '예', value: 'Yes' },
                      { label: '아니오', value: 'NO' },
                    ]}
                    value={stagedSearchFormData.approvalOption}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6} style={{ paddingBottom: '10px' }}>
                  <CFormSelect
                    id="deletionOption"
                    label="삭제된 프롬프트 포함"
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

      <CRow id="PromptSearchResultTable">
        <CCard className="row g-3">
          <CCardBody>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-start">
                <CButton onClick={handleCreateClick}>프롬프트 추가</CButton>
                <CButton
                  disabled={selectedRows?.length === 0 || isDeletedRow(selectedRows)}
                  onClick={() => togglePromptDeleted(true)}
                >
                  삭제
                </CButton>
                <CButton
                  disabled={selectedRows?.length === 0 || !isDeletedRow(selectedRows)}
                  onClick={() => togglePromptDeleted(false)}
                >
                  복구
                </CButton>
                <ExcelDownloadCButton
                  downloadFunction={PredefinedPromptService.getDownloadSearchedPredefinedPromptList}
                  searchFormData={searchFormData}
                  hasSearchResults={promptList?.length !== 0}
                />
              </CCol>
              <CCol className="d-flex justify-content-end">
                <CFormLabel>총 {totalPromptElements} 개의 검색 결과</CFormLabel>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={CommonColumnSorterCustomProps}
                columns={predefinedPromptColumnConfig}
                items={promptList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 프롬프트 개수"
                itemsPerPageSelect
                loading={searchResultIsLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={promptList?.length}
                    isSearchPerformed={isSearchPerformed.current}
                    defaultMessage="검색 조건에 맞는 프롬프트를 검색합니다."
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
      <ModalContainer
        visible={modal.isOpen}
        title={detailFormMode === 'create' ? '프롬프트 추가' : '프롬프트 상세'}
        onClose={modal.closeModal}
        size="lg"
      >
        <PredefinedPromptDetailForm
          closeModal={modal.closeModal}
          initialFormMode={detailFormMode}
          refreshPredefinedPromptList={searchPredefinedPrompt}
        />
      </ModalContainer>
    </>
  );
};

export default PredefinedPromptManagementPage;
