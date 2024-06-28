import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormSelect,
  CInputGroup,
  CLoadingButton,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import StatisticsDetailChart from 'components/statistics/StatisticsDetailChart';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import statisticsService from 'services/statistics/StatisticsService';
import MonthLabelGenerator from 'utils/common/MonthLabelGenerator';
import { CommonColumnSorterCustomProps, CommonTableCustomProps } from 'utils/common/smartTablePropsConfig';
import { StatisticsDocumentCollectionColumnConfig } from 'views/pages/statistics/statisticsDocumentCollectionColumnConfig';

const StatisticsDocumentCollectionManagementPage = () => {
  const [totalStatisticsDataElements, setTotalStatisticsDataElements] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [statisticsDataList, setStatisticsDataList] = useState([]);
  const [clickedData, setClickedData] = useState({});
  const [hasError, setHasError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState({ label: '', value: '' });
  const pastYearMonths = MonthLabelGenerator.pastYearMonthsSelectBoxLabels();
  const lastIndex = pastYearMonths.length - 1;
  const [stagedSelectedMonth, setStagedSelectedMonth] = useState(pastYearMonths[lastIndex]);

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } = usePagination(
    totalStatisticsDataElements,
    'sumInputTokens,desc'
  );

  const isComponentMounted = useRef(true);
  const isSearchPerformed = useRef(false);

  const { addToast } = useToast();
  const modal = useModal();

  const handleMonthSelectBoxChange = (e) => {
    e.preventDefault();
    const selectedMonth = pastYearMonths.find((item) => item.value === e.target.value);
    setStagedSelectedMonth(selectedMonth);
  };

  const searchDocumentCollectionUsageStatistics = useCallback(async () => {
    setSearchResultIsLoading(true);
    if (!isSearchPerformed.current) {
      isSearchPerformed.current = true;
    }
    try {
      const response = await statisticsService.getDocumentCollectionUsageStatistics(selectedMonth.value, pageableData);
      setStatisticsDataList(response.content);
      setTotalStatisticsDataElements(response.totalElements);
    } catch (error) {
      console.log(error);
      setHasError(true);
      addToast({ message: `${error.response.data.message} with ${error.response.status}` });
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [addToast, pageableData, selectedMonth.value]);

  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    setHasError(false);
    setSelectedMonth(stagedSelectedMonth);
  };

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      if (!hasError) {
        void searchDocumentCollectionUsageStatistics();
      }
    }
  }, [hasError, searchDocumentCollectionUsageStatistics]);

  const handleRowClick = (item) => {
    setClickedData(item);
    modal.openModal(item.id);
  };

  const scopedColumns = {
    aggregationName: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item);
        }}
      >
        {item.aggregationName}
      </td>
    ),
    sumInputTokens: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item);
        }}
      >
        {item.sumInputTokens}
      </td>
    ),
    sumOutputTokens: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item);
        }}
      >
        {item.sumOutputTokens}
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
                <CCol>
                  <CInputGroup>
                    <CButton color="white" disabled>
                      기준 월
                    </CButton>
                    <CFormSelect
                      style={{ height: '58px' }}
                      floatingLabel=""
                      options={pastYearMonths}
                      value={stagedSelectedMonth.value}
                      onChange={handleMonthSelectBoxChange}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CLoadingButton loading={searchResultIsLoading} type="submit">
                    검색
                  </CLoadingButton>
                  <CButton
                    color="primary"
                    value="Reset"
                    onClick={() => setStagedSelectedMonth(pastYearMonths[lastIndex])}
                  >
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
              <CCol md={4}>
                {/*TODO Implement ExcelDownload*/}
                <ExcelDownloadCButton />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={CommonColumnSorterCustomProps}
                columns={StatisticsDocumentCollectionColumnConfig}
                items={statisticsDataList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 문서 집합 개수"
                itemsPerPageSelect
                loading={searchResultIsLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={statisticsDataList?.length}
                    isSearchPerformed={isSearchPerformed.current}
                    defaultMessage="선택한 월의 토큰 사용량을 문서 집합 별로 검색합니다."
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
      <ModalContainer visible={modal.isOpen} title={'통계 그래프'} onClose={modal.closeModal} size="lg">
        <StatisticsDetailChart closeModal={modal.closeModal} chartData={clickedData} />
      </ModalContainer>
    </>
  );
};

export default StatisticsDocumentCollectionManagementPage;
