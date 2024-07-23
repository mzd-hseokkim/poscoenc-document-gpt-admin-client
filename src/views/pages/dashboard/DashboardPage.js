import React, { useCallback, useEffect, useState } from 'react';

import { CCol, CRow } from '@coreui/react-pro';
import { DailyTokenUsageChart } from 'components/chart/dashboard/DailyTokenUsageChart';
import { DocumentCollectionTopChatChart } from 'components/chart/dashboard/DocumentCollectionTopChatChart';
import { TotalTokenUsageChart } from 'components/chart/dashboard/TotalTokenUsageChart';
import { MonthlyDocumentCollectionCountWidget } from 'components/chart/dashboard/widzet/MonthlyDocumentCollectionCountWidget';
import { MonthlyPaymentWidget } from 'components/chart/dashboard/widzet/MonthlyPaymentWidget';
import { MonthlyStandardContractCountWidget } from 'components/chart/dashboard/widzet/MonthlyStandardContractCountWidget';
import { MonthlyUserAccountCountWidget } from 'components/chart/dashboard/widzet/MonthlyUserAccountCountWidget';
import { OperationRateWidget } from 'components/chart/dashboard/widzet/OperationRateWidget';
import { PopularModelsRatio } from 'components/dashboard/PopularModelsRatio';
import { RecentlyAddedDocumentList } from 'components/dashboard/RecentlyAddedDocumentList';
import { RecentlyLikedChatHistoryList } from 'components/dashboard/RecentlyLikedChatHistoryList';
import { TopTokenUserList } from 'components/dashboard/TopTokenUserList';
import { useToast } from 'context/ToastContext';
import DashBoardService from 'services/dashboard/DashBoardService';
import { sortByPropertyKeyForMonth } from 'utils/chart/sortByPropertyKeyForMonth';
import { formatToIsoEndDate, formatToIsoStartDate, getCurrentDate, getOneYearAgoDate } from 'utils/common/dateUtils';

const DashboardPage = () => {
  const { addToast } = useToast();

  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const [recentlyAddedDocumentCollectionList, setRecentlyAddedDocumentCollectionList] = useState([]);
  const [accumulatedMonthlyDocumentCollection, setAccumulatedMonthlyDocumentCollection] = useState([]);
  const [topChatDocuments, setTopChatDocuments] = useState([]);
  const [isDocumentStatisticsLoading, setIsDocumentStatisticsLoading] = useState(false);
  const [isPeriodDocumentStatisticsLoading, setIsPeriodDocumentStatisticsLoading] = useState(false);

  const [totalStandardContractDocumentCount, setTotalStandardContractDocumentCount] = useState(0);
  const [recentlyAddedStandardContractList, setRecentlyAddedStandardContractList] = useState([]);
  const [isStandardContractLoading, setIsStandardContractLoading] = useState(false);

  const [totalUserCount, setTotalUserCount] = useState(0);
  const [topTokenUsers, setTopTokenUsers] = useState([]);
  const [isUserStatisticsLoading, setIsUserStatisticsLoading] = useState(false);

  const [recentlyLikedChatList, setRecentlyLikedChatList] = useState([]);
  const [isRecentlyLikedChatLoading, setIsRecentlyLikedChatLoading] = useState(false);

  //전체 토큰 사용량 추이 ( 지난 7일 사용량, 지난 6개월 사용량, 파일럿 모드 별 사용량, AI모델 별 사용량 )
  const [totalTokenUsages, setTotalTokenUsages] = useState([]);
  const [isTokenUsageStatisticsLoading, setIsTokenUsageStatisticsLoading] = useState(false);

  const [errorStates, setErrorStates] = useState({
    documentStatistics: false,
    periodDocumentStatistics: false,
    standardContract: false,
    userStatistics: false,
    recentlyLikedChat: false,
    totalTokenUsages: false,
  });

  //REMIND 문서 공유 횟수 추가 고려
  const fetchData = useCallback(
    async (request, index) => {
      request.loadingFlagSetter(true);
      try {
        const response = await request.service();
        request.onSuccess(response);
      } catch (error) {
        console.log(error);
        request.setError(true);
        addToast({ message: `Request ${index + 1} failed: ${error.message}` }, false);
      } finally {
        request.loadingFlagSetter(false);
      }
    },
    [addToast]
  );

  useEffect(() => {
    const requests = [
      {
        loadingFlagSetter: setIsDocumentStatisticsLoading,
        service: () =>
          DashBoardService.getDocumentCollectionStatistics(
            formatToIsoStartDate(getOneYearAgoDate()),
            formatToIsoEndDate(getCurrentDate())
          ),
        onSuccess: (data) => {
          setTotalDocumentCount(data.totalCount);
          setRecentlyAddedDocumentCollectionList(data.recentlyAdded);
          setTopChatDocuments(data.topChats);
        },
        setError: (hasError) => setErrorStates((prev) => ({ ...prev, documentStatistics: hasError })),
      },
      {
        loadingFlagSetter: setIsPeriodDocumentStatisticsLoading,
        service: () => DashBoardService.getPeriodDocumentCollectionStatistics(),
        onSuccess: (data) => {
          const sortedMonthlyData = sortByPropertyKeyForMonth(data.added.monthly, 'name');
          setAccumulatedMonthlyDocumentCollection(sortedMonthlyData);
        },
        setError: (hasError) => setErrorStates((prev) => ({ ...prev, periodDocumentStatistics: hasError })),
      },
      {
        loadingFlagSetter: setIsStandardContractLoading,
        service: () =>
          DashBoardService.getStandardContractDocumentStatistics(
            formatToIsoStartDate(getOneYearAgoDate()),
            formatToIsoEndDate(getCurrentDate())
          ),
        onSuccess: (data) => {
          setTotalStandardContractDocumentCount(data.totalCount);
          setRecentlyAddedStandardContractList(data.recentlyAdded);
        },
        setError: (hasError) => setErrorStates((prev) => ({ ...prev, standardContract: hasError })),
      },
      {
        loadingFlagSetter: setIsUserStatisticsLoading,
        service: () =>
          DashBoardService.getUserAccountStatistics(
            formatToIsoStartDate(getOneYearAgoDate()),
            formatToIsoEndDate(getCurrentDate())
          ),
        onSuccess: (data) => {
          setTotalUserCount(data.totalCount);
          setTopTokenUsers(data.topTokenUsage);
        },
        setError: (hasError) => setErrorStates((prev) => ({ ...prev, userStatistics: hasError })),
      },
      {
        loadingFlagSetter: setIsRecentlyLikedChatLoading,
        service: () =>
          DashBoardService.getChatHistoryStatistics(
            formatToIsoStartDate(getOneYearAgoDate()),
            formatToIsoEndDate(getCurrentDate())
          ),
        onSuccess: (data) => {
          setRecentlyLikedChatList(data.likedEntry);
        },
        setError: (hasError) => setErrorStates((prev) => ({ ...prev, recentlyLikedChat: hasError })),
      },
      {
        loadingFlagSetter: setIsTokenUsageStatisticsLoading,
        service: () =>
          DashBoardService.getTokenUsageStatistics(
            formatToIsoStartDate(getOneYearAgoDate()),
            formatToIsoEndDate(getCurrentDate())
          ),
        onSuccess: (data) => {
          setTotalTokenUsages(data);
        },
        setError: (hasError) => setErrorStates((prev) => ({ ...prev, totalTokenUsages: hasError })),
      },
    ];

    requests.forEach((request, index) => {
      if (!Object.values(errorStates)[index]) {
        void fetchData(request, index);
      }
    });
  }, [errorStates, fetchData]);

  return (
    <div className="d-flex flex-column flex-grow-1 overflow-auto" style={{ width: '100%' }}>
      {/*REMIND Widget 의 그래프 구현 필요*/}
      <CRow className="justify-content-center">
        <CCol sm={4}>
          <MonthlyPaymentWidget />
        </CCol>
        <CCol sm={4}>
          <OperationRateWidget />
        </CCol>
      </CRow>
      <CRow className="p-3">
        <CCol sm={4}>
          <MonthlyStandardContractCountWidget
            isLoading={isStandardContractLoading}
            totalStandardContractDocumentCount={totalStandardContractDocumentCount}
          />
        </CCol>
        <CCol sm={4}>
          <MonthlyDocumentCollectionCountWidget
            isLoading={isPeriodDocumentStatisticsLoading}
            totalDocumentCount={totalDocumentCount}
            monthlyChartData={accumulatedMonthlyDocumentCollection}
          />
        </CCol>
        <CCol sm={4}>
          <MonthlyUserAccountCountWidget isLoading={isUserStatisticsLoading} totalUserCount={totalUserCount} />
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={6}>
          <DocumentCollectionTopChatChart isLoading={isDocumentStatisticsLoading} chartData={topChatDocuments} />
        </CCol>
        <CCol sm={6}>
          <TotalTokenUsageChart
            isLoading={isTokenUsageStatisticsLoading}
            monthlyChartData={totalTokenUsages?.monthly}
            dailyChartData={totalTokenUsages?.daily}
          />
        </CCol>
      </CRow>

      <CRow className="mt-2">
        <CCol sm={6}>
          <RecentlyAddedDocumentList
            isStandardContractLoading={isStandardContractLoading}
            isDocumentCollectionLoading={isDocumentStatisticsLoading}
            documentCollectionList={recentlyAddedDocumentCollectionList}
            standardContractList={recentlyAddedStandardContractList}
          />
        </CCol>

        <CCol sm={6}>
          <RecentlyLikedChatHistoryList
            isLoading={isRecentlyLikedChatLoading}
            recentlyLikedChatList={recentlyLikedChatList}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} md={6} xl={6}>
          <DailyTokenUsageChart isLoading={isTokenUsageStatisticsLoading} data={totalTokenUsages?.daily} />
        </CCol>

        <CCol xs={12} md={6} xl={6}>
          <PopularModelsRatio
            isLoading={isTokenUsageStatisticsLoading}
            byModelName={totalTokenUsages?.total?.byModelName}
            byPilotMode={totalTokenUsages?.total?.byPilotMode}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <TopTokenUserList isLoading={isUserStatisticsLoading} topTokenUsers={topTokenUsers} />
        </CCol>
      </CRow>
    </div>
  );
};

export default DashboardPage;
