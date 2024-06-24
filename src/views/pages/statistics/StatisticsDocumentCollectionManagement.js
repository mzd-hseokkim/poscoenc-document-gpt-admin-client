import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CButton, CCard, CCardBody, CCol, CDatePicker, CForm, CRow, CSmartTable } from '@coreui/react-pro';
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

const StatisticsDocumentCollectionManagement = () => {
  const [totalStatisticsDataElements, setTotalStatisticsDataElements] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [statisticsDataList, setStatisticsDataList] = useState([]);
  const [clickedData, setClickedData] = useState({});

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } = usePagination(
    totalStatisticsDataElements,
    'sumInputTokens,desc'
  );
  const { addToast } = useToast();
  const isComponentMounted = useRef(true);

  const pastYearMonths = MonthLabelGenerator.pastYearMonthsSelectBoxLabels();
  const lastIndex = pastYearMonths.length - 1;
  const [selectedMonth, setSelectedMonth] = useState({ label: '', value: '' });
  const [stagedSelectedMonth, setStagedSelectedMonth] = useState(pastYearMonths[lastIndex]);

  const modal = useModal();

  const handleMonthSelectBoxChange = (e) => {
    e.preventDefault();
    const changedMonth = pastYearMonths.find((item) => item.value === e.target.value);
    setStagedSelectedMonth(changedMonth);
  };

  const searchDocumentCollectionUsageStatistics = useCallback(async () => {
    if (!isSearchPerformed) {
      setIsSearchPerformed(true);
    }
    try {
      const response = await statisticsService.getDocumentCollectionUsageStatistics(selectedMonth.value, pageableData);
      setStatisticsDataList(response.content);
      setTotalStatisticsDataElements(response.totalElements);
    } catch (error) {
      //REMIND implement error handling
      console.log(error);
      addToast({ color: 'danger', message: `${error.response.data.message} with ${error.response.data.status}` });
    } finally {
      //REMIND implement loading
    }
  }, [addToast, isSearchPerformed, pageableData, selectedMonth.value]);

  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    setSelectedMonth(stagedSelectedMonth);
  };

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchDocumentCollectionUsageStatistics();
    }
  }, [searchDocumentCollectionUsageStatistics]);

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
                  {/*<CInputGroup>*/}
                  {/*  <CButton color="white" disabled>*/}
                  {/*    기준 월*/}
                  {/*  </CButton>*/}
                  {/*  <CFormSelect*/}
                  {/*    style={{ height: '58px' }}*/}
                  {/*    floatingLabel=""*/}
                  {/*    options={pastYearMonths}*/}
                  {/*    value={stagedSelectedMonth.value}*/}
                  {/*    onChange={handleMonthSelectBoxChange}*/}
                  {/*  />*/}
                  {/*</CInputGroup>*/}
                  <CDatePicker placeholder="월 선택" label="Month Picker" locale="ko" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
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
                //REMIND implement loading
                loading={undefined}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={statisticsDataList?.length}
                    isSearchPerformed={isSearchPerformed}
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

export default StatisticsDocumentCollectionManagement;
