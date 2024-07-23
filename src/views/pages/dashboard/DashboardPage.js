import React, { useEffect, useState } from 'react';

import { cilScreenDesktop, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard, CCardBody, CCardHeader, CCol, CProgress, CRow, CSmartTable } from '@coreui/react-pro';
import { DailyTokenUsageChart } from 'components/chart/dashboard/DailyTokenUsageChart';
import { DocumentCollectionTopChatChart } from 'components/chart/dashboard/DocumentCollectionTopChatChart';
import { TotalTokenUsageChart } from 'components/chart/dashboard/TotalTokenUsageChart';
import { MonthlyDocumentCollectionCountWidget } from 'components/chart/dashboard/widzet/MonthlyDocumentCollectionCountWidget';
import { MonthlyPaymentWidget } from 'components/chart/dashboard/widzet/MonthlyPaymentWidget';
import { MonthlyStandardContractCountWidget } from 'components/chart/dashboard/widzet/MonthlyStandardContractCountWidget';
import { MonthlyUserAccountCountWidget } from 'components/chart/dashboard/widzet/MonthlyUserAccountCountWidget';
import { OperationRateWidget } from 'components/chart/dashboard/widzet/OperationRateWidget';
import { RecentlyAddedDocumentList } from 'components/dashboard/RecentlyAddedDocumentList';
import { RecentlyLikedChatHistoryList } from 'components/dashboard/RecentlyLikedChatHistoryList';
import { AIModelIcon } from 'components/icon/AIModelIcon';
import { useToast } from 'context/ToastContext';
import DashBoardService from 'services/dashboard/DashBoardService';
import { sortByPropertyKeyForMonth } from 'utils/chart/sortByPropertyKeyForMonth';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  formatToYMD,
  getCurrentDate,
  getOneYearAgoDate,
} from 'utils/common/dateUtils';

const initialAIModels = [
  { name: 'gpt-4o', value: 0, metadata: { rank: 1 } },
  { name: 'mixtral-8x7b-32768', value: 0, metadata: { rank: 2 } },
  { name: 'llama3-70b-8192', value: 0, metadata: { rank: 3 } },
  { name: 'llama3-8b-8192', value: 0, metadata: { rank: 4 } },
  { name: 'claude-3-opus-20240229', value: 0, metadata: { rank: 5 } },
  { name: 'claude-3-sonnet-20240229', value: 0, metadata: { rank: 6 } },
];
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
  const [hoveredLikedChatIndexes, setHoveredLikedChatIndexes] = useState({});
  const [isRecentlyLikedChatLoading, setIsRecentlyLikedChatLoading] = useState(false);

  //Daily Token Usage Ratio
  const [dailyTokenUsages, setDailyTokenUsages] = useState([]);
  //전체 토큰 사용량 추이 ( 지난 7일 사용량, 지난 6개월 사용량, 파일럿 모드 별 사용량, AI모델 별 사용량 )
  const [totalTokenUsages, setTotalTokenUsages] = useState([]);
  const [isTokenUsageStatisticsLoading, setIsTokenUsageStatisticsLoading] = useState(false);
  // 모든 Pilot 모드의 토큰 사용량 총계
  const totalTokenUsageCalculatedByPilotMode = totalTokenUsages?.total?.byPilotMode?.reduce(
    (acc, item) => acc + item.value,
    0
  );

  // rank 로 정렬한 AI model의 토큰 사용량 총계
  const respondAIModelsUsages = initialAIModels
    .map((model) => {
      const respondModel = totalTokenUsages?.total?.byModelName.find((rm) => rm.name === model.name);
      return respondModel ? { ...model, value: respondModel.value, metadata: respondModel.metadata } : model;
    })
    .sort((a, b) => a.metadata.rank - b.metadata.rank);

  // 모든 AI Model의 토큰 사용량 총계
  const totalTokenUsageCalculatedByAIModel = respondAIModelsUsages.reduce((acc, item) => acc + item.value, 0);

  const [errorStates, setErrorStates] = useState({
    documentStatistics: false,
    standardContract: false,
    userStatistics: false,
    recentlyLikedChat: false,
    totalTokenUsages: false,
    recentlyAddedDocument: false,
  });

  //REMIND 문서 공유 횟수 추가 고려

  useEffect(() => {
    //REMIND error message 관련해서, 에러가 여러개 날 경우 4개의 promise 경합이 발생해서 4개의 에러 메세지 대신 하나의 에러메세지가뜬다. 한개가 여러번 뜨던가.
    const fetchData = async () => {
      if (Object.values(errorStates).some((hasError) => hasError)) {
        return;
      }

      const requests = [
        {
          loadingFlagSetter: setIsDocumentStatisticsLoading,
          service: DashBoardService.getDocumentCollectionStatistics(
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
          service: DashBoardService.getPeriodDocumentCollectionStatistics(),
          onSuccess: (data) => {
            const sortedMonthlyData = sortByPropertyKeyForMonth(data.added.monthly, 'name');
            setAccumulatedMonthlyDocumentCollection(sortedMonthlyData);
          },
          setError: (hasError) => setErrorStates((prev) => ({ ...prev, recentlyAddedDocument: hasError })),
        },
        {
          loadingFlagSetter: setIsStandardContractLoading,
          service: DashBoardService.getStandardContractDocumentStatistics(
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
          service: DashBoardService.getUserAccountStatistics(
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
          service: DashBoardService.getChatHistoryStatistics(
            formatToIsoStartDate(getOneYearAgoDate()),
            formatToIsoEndDate(getCurrentDate())
          ),
          onSuccess: (data) => {
            setRecentlyLikedChatList(data.likedEntry);
            const initialIndexes = {};
            data.likedEntry.forEach((_, index) => {
              initialIndexes[index] = false;
            });
            setHoveredLikedChatIndexes(initialIndexes);
          },
          setError: (hasError) => setErrorStates((prev) => ({ ...prev, recentlyLikedChat: hasError })),
        },
        {
          loadingFlagSetter: setIsTokenUsageStatisticsLoading,
          service: DashBoardService.getTokenUsageStatistics(
            formatToIsoStartDate(getOneYearAgoDate()),
            formatToIsoEndDate(getCurrentDate())
          ),
          onSuccess: (data) => {
            setTotalTokenUsages(data);
          },
          setError: (hasError) => setErrorStates((prev) => ({ ...prev, totalTokenUsages: hasError })),
        },
      ];

      await Promise.allSettled(
        requests.map(async (request, index) => {
          request.loadingFlagSetter(true);
          try {
            const response = await request.service;
            request.onSuccess(response);
          } catch (error) {
            console.log(error);
            request.setError(true);
            addToast({ message: `Request ${index + 1} failed: ${error.message}` }, false);
          } finally {
            request.loadingFlagSetter(false);
          }
        })
      );
    };

    void fetchData();
  }, [addToast, errorStates]);

  // const handleOpenNewContractDocumentTable = () => {
  //   if (standardContractDocumentTableVisible) {
  //     return;
  //   }
  //
  //   setNewContractDocumentTableVisible(!newContractDocumentTableVisible);
  // };
  //
  // const handleOpenStandardContractTable = () => {
  //   if (newContractDocumentTableVisible) {
  //     return;
  //   }
  //
  //   setStandardContractDocumentTableVisible(!standardContractDocumentTableVisible);
  // };

  // LikedChat S ===================

  // LikedChat E ===================

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
            totalStandardContractDocumentCount={totalStandardContractDocumentCount}
            // monthlyChartData={}
          />
        </CCol>
        <CCol sm={4}>
          <MonthlyDocumentCollectionCountWidget
            totalDocumentCount={totalDocumentCount}
            monthlyChartData={accumulatedMonthlyDocumentCollection}
          />
        </CCol>
        <CCol sm={4}>
          <MonthlyUserAccountCountWidget totalUserCount={totalUserCount} />
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={6}>
          {/* 핫독 랭크 S -----------------------------------------------------*/}
          <DocumentCollectionTopChatChart chartData={topChatDocuments} />
          {/* 핫독 랭크 E -----------------------------------------------------*/}
        </CCol>
        <CCol sm={6}>
          <TotalTokenUsageChart monthlyChartData={totalTokenUsages?.monthly} dailyChartData={totalTokenUsages?.daily} />
        </CCol>
      </CRow>

      <CRow className="mt-2">
        <CCol sm={6}>
          <RecentlyAddedDocumentList
            documentCollectionList={recentlyAddedDocumentCollectionList}
            standardContractList={recentlyAddedStandardContractList}
          />
        </CCol>

        <CCol sm={6}>
          <RecentlyLikedChatHistoryList recentlyLikedChatList={recentlyLikedChatList} />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} md={6} xl={6}>
          <DailyTokenUsageChart data={totalTokenUsages?.daily} />
        </CCol>

        <CCol xs={12} md={6} xl={6}>
          <CCard className="m-3">
            <CCardHeader className="bold">Pop-Model</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                    <div className="text-medium-emphasis small">Popular Pilot Mode</div>
                    <div className="fs-5 fw-semibold">
                      {totalTokenUsages?.total?.byPilotMode?.reduce(
                        (maxItem, currentItem) => (currentItem.value > maxItem.value ? currentItem : maxItem),
                        totalTokenUsages?.total?.byPilotMode?.[0].name
                      ) === 'C'
                        ? 'Co'
                        : 'Auto'}
                    </div>
                  </div>
                </CCol>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                    <div className="text-medium-emphasis small">Popular AI Model</div>
                    <div className="fs-5 fw-semibold">GPT-4 Omni</div>
                  </div>
                </CCol>
              </CRow>

              <hr className="mt-0" />

              {totalTokenUsages?.total?.byPilotMode?.map((item, index) => (
                <div className="progress-group mb-4" key={index}>
                  <div className="progress-group-header">
                    <CIcon className="me-2" icon={item.name === 'C' ? cilUser : cilScreenDesktop} size="lg" />
                    <span>{item.name === 'C' ? 'Co' : 'Auto'}</span>
                    <span className="ms-auto fw-semibold">
                      {((item.value / totalTokenUsageCalculatedByPilotMode) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress-group-bars">
                    <CProgress thin color="warning-gradient" value={item.value} />
                  </div>
                </div>
              ))}

              <div className="mb-5"></div>

              {respondAIModelsUsages.map((item, index) => (
                <div className="progress-group" key={index}>
                  <div className="progress-group-header">
                    <AIModelIcon modelName={item.name} />
                    <span>{item.name}</span>
                    <span className="ms-auto fw-semibold">
                      {item.value}
                      <span className="text-medium-emphasis small">
                        ({((item.value / totalTokenUsageCalculatedByAIModel) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="progress-group-bars">
                    <CProgress
                      thin
                      color="success-gradient"
                      value={parseInt(((item.value / totalTokenUsageCalculatedByAIModel) * 100).toFixed(1))}
                    />
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard className="m-3">
        <CCardHeader className="bold">
          <h2>✨ Top Token Users 😎</h2>
        </CCardHeader>
        <CCardBody>
          <CSmartTable
            items={topTokenUsers}
            columns={[
              {
                key: 'name',
                label: '사용자',
                _style: { width: '15%' },
              },
              {
                key: 'team',
                label: '소속',
                _style: { width: '10%', textAlign: 'center' },
              },
              {
                key: 'tokenUsage',
                label: '토큰 사용량',
                _style: { width: '12%', textAlign: 'center' },
              },
              {
                key: 'usedModels',
                label: 'AI Model',
                _style: { width: '10%', textAlign: 'center' },
              },
              {
                key: 'registeredAt',
                label: '가입일',
                _style: { width: '15%', textAlign: 'center' },
              },
            ]}
            scopedColumns={{
              name: (item) => (
                <td>
                  <div>{item.name}</div>
                  {/*REMIND new 뱃지 구현 <span>{item.user.new ? 'New' : 'Recurring'}</span>*/}
                </td>
              ),
              team: (item) => <td className="text-center">{item.metadata.team}</td>,
              tokenUsage: (item) => <td className="text-center">{item.metadata.tokenUsage}</td>,
              usedModels: (item) => (
                <td>
                  <div className="d-flex justify-content-center align-content-center">
                    {item.metadata.usedModels.map((name, index) => (
                      <AIModelIcon key={index} modelName={name} />
                    ))}
                  </div>
                </td>
              ),
              registeredAt: (item) => (
                <td>
                  <div className="text-medium-emphasis text-nowrap text-center">
                    {formatToYMD(item.metadata.registeredAt)}
                  </div>
                </td>
              ),
            }}
            tableProps={{
              align: 'middle',
              className: 'mb-0 border',
              hover: true,
            }}
            tableHeadProps={{
              color: 'secondary',
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default DashboardPage;
