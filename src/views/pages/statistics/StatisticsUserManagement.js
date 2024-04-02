import React, { useEffect, useRef, useState } from 'react';

import { CButton, CCard, CCardBody, CCol, CForm, CFormSelect, CInputGroup, CRow, CSmartTable } from '@coreui/react-pro';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import StatisticsDetailChart from 'components/statistics/StatisticsDetailChart';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import statisticsService from 'services/statistics/StatisticsService';
import MonthLabelGenerator from 'utils/common/MonthLabelGenerator';
import { columnSorterCustomProps, tableCustomProps } from 'utils/common/smartTablePropsConfig';
import { statisticsUserColumnConfig } from 'views/pages/statistics/statisticsUserColumnConfig';

const StatisticsUserManagement = () => {
  const [totalStatisticsDataElements, setTotalStatisticsDataElements] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [statisticsDataList, setStatisticsDataList] = useState([]);
  const [clickedData, setClickedData] = useState({});

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalStatisticsDataElements);
  const { addToast } = useToast();
  const isComponentMounted = useRef(true);

  const pastYearMonths = MonthLabelGenerator.pastYearMonthsSelectBoxLabels();
  const lastIndex = pastYearMonths.length - 1;
  const [selectedMonth, setSelectedMonth] = useState(pastYearMonths[lastIndex].value);
  const modal = useModal();

  const searchUserUsageStatistics = async () => {
    setSearchResultIsLoading(true);

    if (!isSearchPerformed) {
      setIsSearchPerformed(true);
    }
    try {
      const response = await statisticsService.getUserUsageStatistics(selectedMonth, pageableData);
      setStatisticsDataList(response.content);
      setTotalStatisticsDataElements(response.totalElements);
    } catch (error) {
      //REMIND implement error handling
      console.log(error);
      addToast({ color: 'danger', message: `${error.response.data.message} with ${error.response.data.status}` });
    } finally {
      setSearchResultIsLoading(false);
    }
  };
  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    await searchUserUsageStatistics();
  };

  useEffect(() => {
    if (pageableData.sort === 'id,desc') {
      handlePageSortChange({ column: 'sumInputTokens', direction: 'desc' });
    }
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchUserUsageStatistics();
    }
  }, []);

  const handleRowClick = (item) => {
    setClickedData(item);
    modal.openModal(item.id);
  };
  const handleMonthSelectBoxChange = (event) => {
    setSelectedMonth(event.target.value);
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
      <FormLoadingCover isLoading={searchResultIsLoading} />
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
                      value={selectedMonth}
                      onChange={handleMonthSelectBoxChange}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton
                    color="primary"
                    value="Reset"
                    onClick={() => setSelectedMonth(pastYearMonths[lastIndex].value)}
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
                columnSorter={columnSorterCustomProps}
                columns={statisticsUserColumnConfig}
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
                    defaultMessage="선택한 월의 토큰 사용량을 사용자 별로 검색합니다."
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
      <ModalContainer visible={modal.isOpen} title={'통계 그래프'} onClose={modal.closeModal} size="lg">
        <StatisticsDetailChart closeModal={modal.closeModal} chartData={clickedData} />
      </ModalContainer>
    </>
  );
};
export default StatisticsUserManagement;
