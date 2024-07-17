import React, { useEffect, useState } from 'react';

import {
  cilArrowThickFromLeft,
  cilArrowThickFromRight,
  cilBook,
  cilChevronLeft,
  cilChevronRight,
  cilExternalLink,
  cilScreenDesktop,
  cilSitemap,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCloseButton,
  CCol,
  CCollapse,
  CPopover,
  CProgress,
  CRow,
  CSmartTable,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro';
import { DailyTokenUsageChart } from 'components/chart/dashboard/DailyTokenUsageChart';
import { DocumentCollectionTopChatChart } from 'components/chart/dashboard/DocumentCollectionTopChatChart';
import { TotalTokenUsageChart } from 'components/chart/dashboard/TotalTokenUsageChart';
import { MonthlyDocumentCollectionCountWidget } from 'components/chart/dashboard/widzet/MonthlyDocumentCollectionCountWidget';
import { MonthlyPaymentWidget } from 'components/chart/dashboard/widzet/MonthlyPaymentWidget';
import { MonthlyStandardContractCountWidget } from 'components/chart/dashboard/widzet/MonthlyStandardContractCountWidget';
import { MonthlyUserAccountCountWidget } from 'components/chart/dashboard/widzet/MonthlyUserAccountCountWidget';
import { OperationRateWidget } from 'components/chart/dashboard/widzet/OperationRateWidget';
import { AIModelIcon } from 'components/icon/AIModelIcon';
import { useNavigation } from 'context/NavigationContext';
import { useToast } from 'context/ToastContext';
import { isToday } from 'date-fns';
import { PiThumbsUpFill } from 'react-icons/pi';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
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

  const [standardContractDocumentTableVisible, setStandardContractDocumentTableVisible] = useState(false);
  const [newContractDocumentTableVisible, setNewContractDocumentTableVisible] = useState(false);

  const [errorStates, setErrorStates] = useState({
    documentStatistics: false,
    standardContract: false,
    userStatistics: false,
    recentlyLikedChat: false,
    totalTokenUsages: false,
    recentlyAddedDocument: false,
  });

  //REMIND 문서 공유 횟수 추가 고려

  const { navigate } = useNavigation();

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

  const handleOpenNewContractDocumentTable = () => {
    if (standardContractDocumentTableVisible) {
      return;
    }

    setNewContractDocumentTableVisible(!newContractDocumentTableVisible);
  };

  const handleOpenStandardContractTable = () => {
    if (newContractDocumentTableVisible) {
      return;
    }

    setStandardContractDocumentTableVisible(!standardContractDocumentTableVisible);
  };

  //REMIND 응답받은 entry 의 id 로 검색해서 가져오거나, 한번에 받아오거나 결정 필요.
  const AnswerExample = [
    {
      message: '안녕하세요 무엇을 도와드릴까요?',
    },
    {
      message:
        '### 핵심 답변 한 줄 요약\n해당 계약서는 한국파파존스㈜와 메가존 주식회사 간에 통합 메시지 서비스 제공에 관한 계약서로, 서비스 제공, 사용료 정산, 계약 기간, 서비스 제공 중단 및 변경, 비용 및 대금 결제, 담보조건, 계약 해지, 손해배상, 비밀유지, 면책, 계약의 해석, 관할법원 등에 대한 내용이 포함되어 있습니다.\n\n---\n\n### 상세 답변\n\n해당 계약서는 한국파파존스㈜와 메가존 주식회사 간에 통합 메시지 서비스 제공에 관한 계약서입니다. 이를 상세히 설명하면, \n1. 계약의 목적은 [동]에 대해 [행]이 통합 메시지 서비스를 제공하고, [행]에 대해 [동]이 서비스에 대한 사용료를 정산함에 따른 쌍방의 권리와 의무를 명시하고, 이를 성실히 이행함으로써 상호 이익을 증진하는데 그 목적이 있다.\n2. 계약의 기간은 쌍방의 서비스 개시일로부터 1 년간으로 한다. 서비스의 종료는 [동]이 서비스 종료 20 영업일 전에 [행]에 서면 통보함으로써 종료된다.\n3. [행]이 제공하는 “통합 메시지 서비스”는 [동]이 지정한 “고객”에게 [동]이 제공하는 정보(“통합 메시지”의 내용)를 [행]의 시스템을 통해 “고객”에게 전달하는 것에 한한다.\n4. [행]은 본 계약과 관련하여 발생되는 [동]의 채무를 담보하기 위하여 담보제공을 요청할 수 있으며, [동]은 보증보험증권 또는 현금예치 등의 담보를 제공해야 한다.\n5. 계약 당사자는 다음 각 호에 해당하는 경우에는 본 계약 불이행에 대하여 계약 당사자간 책임을 지지 않는다. 천재지변, 폭동, 전쟁, 소요사태 또는 이에 준하는 사유로 불가항력적으로 발생된 경우, 정부(지방자치단체, 감독기관 포함)의 규제로 인하여 불가항력적으로 발생된 경우, 계약당사자간에 서면으로 합의한 경우, 각 당사자의 귀책이 아님을 증명한 경우 등이 해당됩니다.\n\n---\n\n### 추가 정보\n\n해당 계약서에 대한 연관 정보가 다음과 같이 검색되었습니다.\n1. 계약서에는 통합 메시지 서비스를 제공하는 [행]과 이를 이용하는 [동]의 권리와 의무가 상세히 기술되어 있습니다.\n2. 계약 기간은 1년이며, 계약 해지를 원할 경우 20 영업일 전에 서면으로 통보해야 합니다.\n3. [행]은 [동]의 채무를 담보하기 위해 담보제공을 요청할 수 있으며, 이에 [동]은 보증보험증권 또는 현금예치 등의 담보를 제공해야 합니다.\n\n---\n\n### 출처\n\n- 계약의 목적 : 1조 (2 page)\n- 계약의 기간 : 3조 (2 page)\n- 서비스의 범위 : 5조 (3 page)\n- 담보조건 : 8조 (3 page)\n- 면책 : 16조 (5 page)\n\n---\n\n### 추가 질문\n- 계약 기간이 종료된 후에는 어떻게 되나요?\n- 담보제공을 요청받았을 때, [동]이 응하지 않으면 어떻게 되나요?\n- 계약 당사자가 불이행했을 때의 책임은 어떻게 되나요?\n\n---\n\n',
    },
  ];

  // LikedChat S ===================
  const customPopoverStyle = {
    '--cui-popover-max-width': '500px',
    '--cui-popover-max-height': '1000px',
    '--cui-popover-border-color': 'var(--cui-primary)',
    '--cui-popover-header-bg': 'var(--cui-primary)',
    '--cui-popover-header-color': 'var(--cui-white)',
  };

  const togglePopoverVisibility = (index) => {
    setHoveredLikedChatIndexes((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
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
          <CCard className="m-3" style={{ minHeight: '20rem' }}>
            <CCardHeader className="bold"> 최근 등록된 표준 계약서 & 계약 문서 </CCardHeader>
            <CCardBody className="table-wrapper">
              <div
                className={`table-container ${standardContractDocumentTableVisible ? 'table-expanded-right' : ''}`}
                style={{
                  zIndex: standardContractDocumentTableVisible ? 2 : 1,
                  opacity: newContractDocumentTableVisible ? 0.15 : 1,
                  marginRight: standardContractDocumentTableVisible ? '-300px' : '-40px',
                }}
              >
                <CTable align="middle" className="mb-0 border ms-2" hover>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell
                        style={{ cursor: newContractDocumentTableVisible ? '' : 'pointer' }}
                        onClick={handleOpenStandardContractTable}
                      >
                        Standard Con
                        <CIcon
                          style={{ marginLeft: '1rem' }}
                          icon={standardContractDocumentTableVisible ? cilChevronLeft : cilChevronRight}
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>
                        <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                          <div className="d-flex justify-content-center">
                            <CPopover
                              placement="top"
                              trigger={['hover', 'focus']}
                              content={'해당 표준 계약서에 의해 작성된 계약서 개수입니다.'}
                            >
                              <CIcon icon={cilSitemap} size={'lg'} />
                            </CPopover>
                          </div>
                        </CCollapse>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                          <p className="collapsable-table-header">CreatedAt</p>
                        </CCollapse>
                      </CTableHeaderCell>

                      {standardContractDocumentTableVisible && (
                        <CTableHeaderCell>
                          <CCollapse visible={standardContractDocumentTableVisible} horizontal></CCollapse>
                        </CTableHeaderCell>
                      )}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {recentlyAddedStandardContractList.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          {item.name.length > 12 ? (
                            <CPopover content={item.name} placement="bottom" trigger="hover" delay={300}>
                              <div
                                className="overflow-hidden text-truncate"
                                style={{
                                  maxWidth: '11rem',
                                }}
                              >
                                {item.name}
                              </div>
                            </CPopover>
                          ) : (
                            <div
                              className="overflow-hidden text-truncate"
                              style={{
                                maxWidth: '11rem',
                              }}
                            >
                              {item.name}
                            </div>
                          )}
                          {!standardContractDocumentTableVisible && isToday(new Date(item.createdAt)) && (
                            <CBadge
                              color="primary"
                              style={{
                                position: 'absolute',
                                top: 12 + 41 * (index + 1),
                                right: 1.5,
                              }}
                            >
                              Today
                            </CBadge>
                          )}
                        </CTableDataCell>

                        <CTableDataCell>
                          <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                            <div className="fw-semibold text-nowrap align-middle">{item.referCnt} 개</div>
                          </CCollapse>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                            <div className="small text-medium-emphasis text-nowrap">{formatToYMD(item.createdAt)}</div>
                          </CCollapse>
                        </CTableDataCell>

                        {standardContractDocumentTableVisible && (
                          <CTableDataCell>
                            <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                              <CIcon
                                style={{ cursor: 'pointer' }}
                                icon={cilExternalLink}
                                //REMIND ID 파라미터 추가해서 해당 문서 보여주도록 수정
                                onClick={() => navigate(`/standard-contracts/management?id=${item.id}`)}
                              />
                            </CCollapse>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
              <div
                className={`table-container ${newContractDocumentTableVisible ? 'table-expanded-left' : ''}`}
                style={{
                  zIndex: newContractDocumentTableVisible ? 2 : 1,
                  opacity: standardContractDocumentTableVisible ? 0.15 : 1,
                  marginLeft: newContractDocumentTableVisible ? '-310px' : '-15px',
                }}
              >
                <CTable align="middle" className="mb-0 border me-2" hover responsive={'lg'}>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell
                        style={{ cursor: standardContractDocumentTableVisible ? '' : 'pointer' }}
                        onClick={handleOpenNewContractDocumentTable}
                      >
                        Con
                        <CIcon
                          style={{ marginLeft: '5rem' }}
                          icon={newContractDocumentTableVisible ? cilArrowThickFromLeft : cilArrowThickFromRight}
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <CCollapse visible={newContractDocumentTableVisible} horizontal>
                          <p className="collapsable-table-header">New Chat</p>
                        </CCollapse>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <CCollapse visible={newContractDocumentTableVisible} horizontal>
                          <p className="collapsable-table-header">CreatedAt</p>
                        </CCollapse>
                      </CTableHeaderCell>

                      {newContractDocumentTableVisible && (
                        <>
                          <CTableHeaderCell>
                            <CCollapse visible={newContractDocumentTableVisible} horizontal></CCollapse>
                          </CTableHeaderCell>
                        </>
                      )}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {recentlyAddedDocumentCollectionList.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          {item.name.length > 12 ? (
                            <CPopover content={item.name} placement="bottom" trigger="hover" delay={300}>
                              <div
                                className="overflow-hidden text-truncate"
                                style={{
                                  maxWidth: '11rem',
                                }}
                              >
                                {item.name}
                              </div>
                            </CPopover>
                          ) : (
                            <div
                              className="overflow-hidden text-truncate"
                              style={{
                                maxWidth: '11rem',
                              }}
                            >
                              {item.name}
                            </div>
                          )}
                          {!newContractDocumentTableVisible && isToday(new Date(item.createdAt)) && (
                            <CBadge
                              color="primary"
                              style={{
                                position: 'absolute',
                                top: 12 + 41 * (index + 1),
                                right: 1.5,
                              }}
                            >
                              Today
                            </CBadge>
                          )}
                        </CTableDataCell>

                        <CTableDataCell>
                          <CCollapse visible={newContractDocumentTableVisible} horizontal>
                            <div className="collapsable-table-data">
                              {/*<div className="small text-medium-emphasis">New</div>*/}
                              <div className="fw-semibold text-nowrap small text-medium-emphasis">
                                {formatToYMD(item.metadata.lastChatAt) || 'No chat'}
                              </div>
                            </div>
                          </CCollapse>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CCollapse visible={newContractDocumentTableVisible} horizontal>
                            <div className="small text-medium-emphasis text-nowrap">{formatToYMD(item.createdAt)}</div>
                          </CCollapse>
                        </CTableDataCell>
                        {newContractDocumentTableVisible && (
                          <>
                            <CTableDataCell>
                              <CCollapse visible={newContractDocumentTableVisible} horizontal>
                                <CIcon
                                  style={{ cursor: 'pointer' }}
                                  icon={cilExternalLink}
                                  //REMIND 아래 링크에서 없는 아이디로 요청 할 경우 서버에서 오류발생이라는 에러가 잘못뜨고있다. 찾을수없음으로 변경
                                  onClick={() => navigate(`/document-collections/management?id=${item.id}`)}
                                />
                              </CCollapse>
                            </CTableDataCell>
                          </>
                        )}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6}>
          {/* 채팅 통계 정보 S*/}
          <CCard className="m-3" style={{ minHeight: '20rem' }}>
            <CCardHeader className="d-flex align-items-center justify-content-between bold">
              최근 좋아요 표시된 답변
              <small className="text-medium-emphasis"> 질문 클릭 시 해당 답변을 볼 수 있습니다.</small>
            </CCardHeader>
            <CCardBody>
              <CSmartTable
                items={recentlyLikedChatList}
                // pagination={true}
                columns={[
                  {
                    key: 'documentCollectionDisplayName',
                    label: '해당 문서',
                    _style: { width: '15%' },
                    _props: { className: 'text-center' },
                    filter: false,
                    sorter: false,
                  },
                  { key: 'name', label: '질문', _props: { className: 'text-nowrap' }, _style: { width: '25%' } },
                  { key: 'modelName', label: 'Model', _style: { width: '20%' }, _props: { className: 'text-center' } },

                  { key: 'pilotMode', label: 'Pilot', _style: { width: '10%' } },
                  { key: 'createdAt', label: 'CreatedAt', _style: { width: '10%' } },
                  {
                    key: 'externalLink',
                    label: '',
                    _style: { width: '5%' },
                    filter: false,
                    sorter: false,
                  },
                ]}
                tableProps={{
                  align: 'middle',
                  className: 'mb-0 border',
                  hover: true,
                }}
                tableHeadProps={{
                  color: 'secondary',
                }}
                scopedColumns={{
                  documentCollectionDisplayName: (item) => (
                    <td className="text-center">
                      <CPopover
                        content={<div className="bold">{item.metadata.documentCollectionDisplayName}</div>}
                        placement="bottom"
                        trigger="hover"
                        delay={300}
                        style={{
                          '--cui-popover-border-color': 'var(--cui-primary)',
                        }}
                      >
                        <CIcon
                          icon={cilBook}
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            navigate(`/document-collections/management?id=${item.metadata.documentCollectionId}`)
                          }
                        />
                      </CPopover>
                    </td>
                  ),
                  name: (item, index) => (
                    <CPopover
                      title={
                        <>
                          <CRow className="">
                            <CCol sm={4} className="d-flex align-items-end">
                              <h6 id="answer">답변</h6>
                            </CCol>
                            <CCol sm={8} className="d-flex align-content-center justify-content-end">
                              <CBadge color={'info'} id="modelName" className="m-2 text-center align-content-center">
                                {item.metadata.modelName}
                              </CBadge>
                              <CBadge color={'primary'} id="pilotMode" className="m-2">
                                {item.metadata.pilotMode === 'C' ? 'Co-pilot' : 'Auto-pilot'}
                              </CBadge>
                              <CBadge
                                id="thumb"
                                style={{ backgroundColor: '#3f66fc', margin: '.5rem 1rem .5rem .25rem' }}
                              >
                                <PiThumbsUpFill />
                              </CBadge>
                              <CCloseButton
                                className="align-self-center"
                                style={{
                                  filter: 'var(--cui-btn-close-white-filter)',
                                }}
                                onClick={() => togglePopoverVisibility(index)}
                              />
                            </CCol>
                          </CRow>
                        </>
                      }
                      content={
                        // REMIND ID 로 다시 불러오는걸로 일단 구현
                        <>
                          <CCard>
                            <CCollapse visible={index !== null}>
                              <CCardBody style={{ maxHeight: '600px', overflowX: 'scroll' }}>
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw]}
                                  className="reactMarkdown"
                                >
                                  {AnswerExample?.[index]?.message}
                                </ReactMarkdown>
                              </CCardBody>
                            </CCollapse>
                          </CCard>
                        </>
                      }
                      placement="bottom"
                      trigger={[]}
                      visible={hoveredLikedChatIndexes[index]}
                      style={customPopoverStyle}
                    >
                      <td onClick={() => togglePopoverVisibility(index)} style={{ cursor: 'pointer' }}>
                        <CPopover content={item.name} placement="top" trigger="hover" delay={300}>
                          <div
                            className="overflow-hidden text-truncate"
                            style={{
                              maxWidth: '12rem',
                              overflowY: 'hidden',
                            }}
                          >
                            {item.name}
                          </div>
                        </CPopover>
                      </td>
                    </CPopover>
                  ),
                  modelName: (item) => (
                    <td
                      className="overflow-hidden text-truncate"
                      style={{
                        maxWidth: '6rem',
                        overflowY: 'hidden',
                      }}
                    >
                      <div className="d-flex justify-content-center align-content-center">
                        <AIModelIcon modelName={item.metadata.modelName} />
                      </div>
                    </td>
                  ),
                  pilotMode: (item) => (
                    <td className="text-center">
                      <CIcon icon={item.metadata.pilotMode === 'A' ? cilScreenDesktop : cilUser} />
                    </td>
                  ),
                  createdAt: (item) => (
                    <td className="text-center">
                      <div className="text-medium-emphasis text-nowrap">{formatToYMD(item.recordedAt)}</div>
                    </td>
                  ),

                  externalLink: (item) => (
                    <td className="text-center">
                      <CIcon
                        style={{ cursor: 'pointer' }}
                        icon={cilExternalLink}
                        //REMIND 권한에 따른 버튼 블록 기능 구현 필요
                        onClick={() => navigate(`/document-collections-chat-history/management?id=${item.id}`)}
                      />
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
          {/* 채팅 통계 정보 E*/}
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
