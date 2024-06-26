import React, { useEffect, useState } from 'react';

import {
  cibFacebook,
  cibGoogle,
  cibLinkedin,
  cibTwitter,
  cilArrowBottom,
  cilArrowThickFromLeft,
  cilArrowThickFromRight,
  cilArrowTop,
  cilBook,
  cilChevronLeft,
  cilChevronRight,
  cilExternalLink,
  cilOptions,
  cilPeople,
  cilScreenDesktop,
  cilSitemap,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChart, CChartLine } from '@coreui/react-chartjs';
import {
  CAvatar,
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCloseButton,
  CCol,
  CCollapse,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CPopover,
  CProgress,
  CProgressBar,
  CRow,
  CSmartTable,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsA,
  CWidgetStatsB,
} from '@coreui/react-pro';
import { getStyle, hexToRgba } from '@coreui/utils';
import { mergeAndSumArrays } from 'components/chart/utils/ChartStatisticsProcessor';
import { useNavigation } from 'context/NavigationContext';
import { useToast } from 'context/ToastContext';
import { PiThumbsUpFill } from 'react-icons/pi';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import DashBoardService from 'services/dashboard/DashBoardService';
import { formatToIsoEndDate, formatToIsoStartDate, getCurrentDate, getOneYearAgoDate } from 'utils/common/dateUtils';

const DashboardPage = () => {
  const { addToast } = useToast();

  // const dailyTokenUsagesExampleLabels = useMemo(() => dailyTokenUsagesExample.map((item) => item.title), []);
  //
  // const dailyTokenUsagesExampleInputToken = useMemo(() => dailyTokenUsagesExample.map((item) => item.InputTokens), []);
  //
  // const dailyTokenUsagesExampleOutputToken = useMemo(
  //   () => dailyTokenUsagesExample.map((item) => item.OutputTokens),
  //   []
  // );

  //REMIND API 연동 후 hoveredLikedChatIndexes 초기값 로직 변경 예정
  const [hoveredLikedChatIndexes, setHoveredLikedChatIndexes] = useState({
    0: false,
    1: false,
  });

  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const [recentlyAddedDocumentList, setRecentlyAddedDocumentList] = useState([]);
  const [hotDocumentEntries, setHotDocumentEntries] = useState([]);
  const [totalStandardContractDocumentCount, setTotalStandardContractDocumentCount] = useState(0);
  const [recentlyAddedStandardContractList, setRecentlyAddedStandardContractList] = useState([]);

  const [totalUserCount, setTotalUserCount] = useState(0);
  const [isUserStatisticsLoading, setIsUserStatisticsLoading] = useState(false);

  const [recentlyLikedChatList, setRecentlyLikedChatList] = useState([]);
  const [isRecentlyLicedChatLoading, setIsRecentlyLicedChatLoading] = useState(false);

  const [standardContractDocumentTableVisible, setStandardContractDocumentTableVisible] = useState(false);
  const [newContractDocumentTableVisible, setNewContractDocumentTableVisible] = useState(false);

  const [isDocumentStatisticsLoading, setIsDocumentStatisticsLoading] = useState(false);
  const [isStandardContractLoading, setIsStandardContractLoading] = useState(false);
  const [hotConChartLabelOption, setHotConChartLabelOption] = useState('days');
  const [totalTokenUsageChartLabelOption, setTotalTokenUsageChartLabelOption] = useState('months');
  //REMIND 문서 공유 횟수 추가 고려

  const { navigate } = useNavigation();

  //REMIND hotDocumentEntries 로 수정
  const hotDocTopFive = [
    { name: 'Marl-E CMS in POSCO Corp.', value: '29,703 ', color: 'success' },
    { name: 'Marl-E CMS in MZC.', value: '24,093 ', color: 'info' },
    { name: 'Alphabetone', value: '78,706 ', color: 'warning' },
    { name: '여섯글자는괜', value: '22,123 ', color: 'danger' },
    { name: '여덟글자입니다요', value: '22,222 ', color: 'primary' },
  ];
  useEffect(() => {
    const documentStatistics = async () => {
      setIsDocumentStatisticsLoading(true);
      try {
        const response = await DashBoardService.getDocumentCollectionStatistics(
          formatToIsoStartDate(getOneYearAgoDate()),
          formatToIsoEndDate(getCurrentDate())
        );
        setTotalDocumentCount(response.totalCount);
        setRecentlyAddedDocumentList(response.recentlyAdded);
        setHotDocumentEntries(response.topEntries);
        console.log(response.topEntries);
      } catch (error) {
        console.log(error);
        addToast({ message: '문서 집합에 대한 통계 정보를 가져오지 못했습니다' });
      } finally {
        setIsDocumentStatisticsLoading(false);
      }
    };

    void documentStatistics();
  }, [addToast]);

  useEffect(() => {
    const standardContractStatistics = async () => {
      setIsStandardContractLoading(true);
      try {
        const response = await DashBoardService.getStandardContractDocumentStatistics(
          formatToIsoStartDate(getOneYearAgoDate()),
          formatToIsoEndDate(getCurrentDate())
        );
        setTotalStandardContractDocumentCount(response.totalCount);
        setRecentlyAddedStandardContractList(response.recentlyAdded);
      } catch (error) {
        console.log(error);
        addToast({ message: ' 표준 계약서에 대한 통계 정보를 가져오지 못했습니다.' });
      } finally {
        setIsStandardContractLoading(false);
      }
    };
    void standardContractStatistics();
  }, [addToast]);

  useEffect(() => {
    const userStatistics = async () => {
      setIsUserStatisticsLoading(true);
      try {
        const response = await DashBoardService.getUserAccountStatistics(
          formatToIsoStartDate(getOneYearAgoDate()),
          formatToIsoEndDate(getOneYearAgoDate())
        );
        setTotalUserCount(response.totalCount);
      } catch (error) {
      } finally {
        setIsUserStatisticsLoading(false);
      }
    };

    void userStatistics();
  }, []);

  useEffect(() => {
    const chatStatistics = async () => {
      setIsRecentlyLicedChatLoading(true);
      try {
        const response = await DashBoardService.getChatHistoryStatistics(
          formatToIsoStartDate(getOneYearAgoDate()),
          formatToIsoEndDate(getOneYearAgoDate())
        );
        setRecentlyLikedChatList(response.likedEntry);
      } catch (error) {
      } finally {
        setIsRecentlyLicedChatLoading(false);
      }
    };

    void chatStatistics();
  }, []);

  const tokenUsagesData = [
    { title: 'Total', value: '102,799 ', percent: 100, color: 'success' },
    { title: 'Input Tokens', value: '24,093 ', percent: parseInt(((24093 / 102799) * 100).toFixed(0)), color: 'info' },
    {
      title: 'Output Tokens',
      value: '78,706 ',
      percent: parseInt(((78706 / 102799) * 100).toFixed(0)),
      color: 'warning',
    },
    {
      title: 'Remaining',
      value: '190,000 ',
      percent: parseInt(((1 - 102799 / 190000) * 100).toFixed(1)),
      color: 'danger',
    },
  ];

  const popularPilotModeExample = [
    { title: 'Auto', icon: cilScreenDesktop, value: 53 },
    { title: 'Co', icon: cilUser, value: 47 },
  ];

  const popularModelExample = [
    { title: 'GPT-4 Omni', icon: cibGoogle, percent: 58, value: '221,832' },
    { title: 'Claude-3-Sonnet', icon: cibFacebook, percent: 15, value: '57,370' },
    { title: 'Claude-3-Opus', icon: cibFacebook, percent: 10, value: '38,247' },
    { title: 'Llama3-8B', icon: cibTwitter, percent: 8, value: '30,598' },
    { title: 'Llama3-70B', icon: cibTwitter, percent: 6, value: '22,948' },
    { title: 'Mixtral 8x7B', icon: cibLinkedin, percent: 3, value: '11,474' },
  ];

  const flexerExample = [
    {
      avatar: { src: '/images/avatars/1.jpg', status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      team: '영업 1팀 ',
      usage: {
        value: 550,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibGoogle },
      activity: '10 sec ago',
    },
    {
      avatar: { src: '/images/avatars/1.jpg', status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      team: '영업 2팀',
      usage: {
        value: 229,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibGoogle },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: '/images/avatars/1.jpg', status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      team: '영업 1팀',
      usage: {
        value: 174,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibGoogle },
      activity: '1 hour ago',
    },
    {
      avatar: { src: '/images/avatars/1.jpg', status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
      team: '영업 2팀',
      usage: {
        value: 108,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibFacebook },
      activity: 'Last month',
    },
    {
      avatar: { src: '/images/avatars/1.jpg', status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
      team: '영업 4팀',
      usage: {
        value: 77,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibGoogle },
      activity: 'Last week',
    },
    {
      avatar: { src: '/images/avatars/1.jpg', status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      team: ' 영업 4팀',
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibGoogle },
      activity: 'Last week',
    },
  ];

  const DocsExample = [
    {
      displayName: {
        name: '나는이름이열글자일거 에요',
        new: true,
        registered: 'Jan 1, 2021',
      },
      activity: '10 sec ago',
    },
    {
      displayName: {
        name: '계약 문서 2 하지만 이름이 너무나도 길어서 안보여야만하는데 어디까지 늘어날 생각이니 너는...3줄까지 내려간다면 나도 어쩔수 없이 계속해서 늘려야만 해. 그냥 계속 늘어날 생각이구나 너는하지만 이름이 너무나도 길어서 안보여야만하는데 어디까지 늘어날 생각이니 너는...3줄까지 내려간다면 나도 어쩔수 없이 계속해서 늘려야만 해. 그냥 계속 늘어날 생각이구나 너는하지만 이름이 너무나도 길어서 안보여야만하는데 어디까지 늘어날 생각이니 너는...3줄까지 내려간다면 나도 어쩔수 없이 계속해서 늘려야만 해. 그냥 계속 늘어날 생각이구나 너는하지만 이름이 너무나도 길어서 안보여야만하는데 어디까지 늘어날 생각이니 너는...3줄까지 내려간다면 나도 어쩔수 없이 계속해서 늘려야만 해. 그냥 계속 늘어날 생각이구나 너는하지만 이름이 너무나도 길어서 안보여야만하는데 어디까지 늘어날 생각이니 너는...3줄까지 내려간다면 나도 어쩔수 없이 계속해서 늘려야만 해. 그냥 계속 늘어날 생각이구나 너는하지만 이름이 너무나도 길어서 안보여야만하는데 어디까지 늘어날 생각이니 너는...3줄까지 내려간다면 나도 어쩔수 없이 계속해서 늘려야만 해. 그냥 계속 늘어날 생각이구나 너는',
        new: false,
        registered: 'Jan 1, 2021',
      },
      activity: '5 minutes ago',
    },
    {
      displayName: { name: '계약 문서 6', new: true, registered: 'Jan 1, 2021' },
      activity: '1 hour ago',
    },
    {
      displayName: { name: '계약 문서 3', new: true, registered: 'Jan 1, 2021' },
      activity: 'Last month',
    },
    {
      displayName: {
        name: '계약 문서 4',
        new: true,
        registered: 'Jan 1, 2021',
      },
      activity: 'Last week',
    },
    {
      displayName: {
        name: '계약 문서 16',
        new: true,
        registered: 'Jan 1, 2021',
      },
      activity: 'Last week',
    },
  ];

  const handleOpenNewContractDocumentTable = () => {
    if (standardContractDocumentTableVisible) {
      return;
    }

    setNewContractDocumentTableVisible(!newContractDocumentTableVisible);
  };

  const standardContractsExample = [
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'success' },
      displayName: {
        name: '표준 계약 문서 1',
        new: true,
        registered: 'Jan 1, 2021',
      },
      usage: 50,
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'danger' },
      displayName: {
        name: '열글자짜리표준계약문 서에요',
        new: false,
        registered: 'Jan 1, 2021',
      },
      usage: 22,
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'warning' },
      displayName: { name: '표준 계약 문서 6', new: true, registered: 'Jan 1, 2021' },
      usage: 74,
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'secondary' },
      displayName: { name: '표준 계약 문서 3', new: true, registered: 'Jan 1, 2021' },
      usage: 98,
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'success' },
      displayName: {
        name: '아홉글자는어떤가요',
        new: true,
        registered: 'Jan 1, 2021',
      },
      usage: 22,
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'danger' },
      displayName: {
        name: '표준 계약 문서 16',
        new: true,
        registered: 'Jan 1, 2021',
      },
      usage: 43,
    },
  ];

  const handleOpenStandardContractTable = () => {
    if (newContractDocumentTableVisible) {
      return;
    }

    setStandardContractDocumentTableVisible(!standardContractDocumentTableVisible);
  };

  //REMIND recentlyLikedChatList 로 변경해야함..
  const ChatExample = [
    {
      id: 3,
      //REMIND 버젼 업 할때 고려.
      documentCollection: '문서1',
      question: `안녕?`,
      modelName: 'GPT-4 Omni',
      pilotMode: 'A',
      createdAt: '2024-06-12',
    },
    {
      id: 8,
      documentCollection: '문서2',
      question: `이 계약서의 계약 기간과 계약금액, 배상금에 대한 내용들을 알려줘.`,
      modelName: 'Claude-3-Opus',
      pilotMode: 'C',
      createdAt: '2024-06-11',
    },
    // 더 많은 데이터 추가 가능
  ];

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

  const customPopoverStyle = {
    '--cui-popover-max-width': '500px',
    '--cui-popover-max-height': '1000px',
    '--cui-popover-border-color': 'var(--cui-primary)',
    '--cui-popover-header-bg': 'var(--cui-primary)',
    '--cui-popover-header-color': 'var(--cui-white)',
  };
  // LikedChat S ===================

  //REMIND api 구현 후, 컴포넌트로 분리후 아래 로직 구현. hoveredLikedIndexes 에 초기값 설정하는 로직
  //   useEffect(() => {
  //     const initialIndexes = {};
  //     rows.forEach((_, index) => {
  //       initialIndexes[index] = false;
  //     });
  //     setHoveredLikedChatIndexes(initialIndexes);
  //   }, [rows]);
  const togglePopoverVisibility = (index) => {
    console.log(index);
    setHoveredLikedChatIndexes((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  // LikedChat E ===================

  return (
    <div className="d-flex flex-column flex-grow-1 overflow-auto" style={{ width: '100%' }}>
      <CRow className="p-3">
        <CCol sm={4}>
          <div id="totalDocumentCountDiv">
            <CWidgetStatsA
              color="primary"
              value={
                <>
                  {`${totalDocumentCount} 개`}
                  <span className="fs-6 fw-normal">
                    (40.9% <CIcon icon={cilArrowTop} /> , 월간)
                  </span>
                </>
              }
              title="등록된 계약서"
              action={
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-white" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              }
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: '#5856d6',
                        data: [65, 59, 84, 84, 51, 55, 40],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        border: {
                          display: false,
                        },
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        min: 30,
                        max: 89,
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                        tension: 0.4,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </div>
        </CCol>
        <CCol sm={4}>
          <CWidgetStatsA
            color="info"
            value={
              <>
                {`${totalStandardContractDocumentCount} 개`}
                <span className="fs-6 fw-normal">
                  (40.9% <CIcon icon={cilArrowBottom} />, 월간)
                </span>
              </>
            }
            title="등록된 표준 문서"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-white" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: '#39f',
                      data: [1, 18, 9, 17, 34, 22, 11],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: -9,
                      max: 39,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={4}>
          <CWidgetStatsA
            color="warning"
            value={
              <>
                {`${totalUserCount} 명`}
                <span className="fs-6 fw-normal">
                  (1.9% <CIcon icon={cilArrowTop} />, 월간)
                </span>
              </>
            }
            title="등록된 사용자"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-white" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [78, 81, 80, 45, 34, 12, 40],
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={6}>
          {/* 핫독 랭크 S -----------------------------------------------------*/}
          <CCard className="m-3">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="HotCon" className="card-title mb-0">
                    🔥Hot🔥 Con TOP 5
                  </h4>
                  <div className="small text-medium-emphasis">January - July 2021</div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButtonGroup className="float-end me-3">
                    {['days', 'months'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        active={value === hotConChartLabelOption}
                        onClick={() => setHotConChartLabelOption(value)}
                      >
                        {value === 'days' ? '지난 7일' : '지난 6개월'}
                      </CButton>
                    ))}
                  </CButtonGroup>
                </CCol>
              </CRow>
              <CChartLine
                style={{ height: '300px', marginTop: '40px' }}
                data={{
                  labels: hotConChartLabelOption === 'days' ? weeklyLabel : monthlyLabel,
                  datasets: [
                    {
                      label: 'Marl-E CMS in POSCO Corp.',
                      // backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-info'),
                      pointHoverBackgroundColor: getStyle('--cui-info'),
                      borderWidth: 2,
                      data: randomSevenElementsChartData,
                      fill: true,
                    },
                    {
                      label: 'Marl-E CMS in MZC.',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-success'),
                      pointHoverBackgroundColor: getStyle('--cui-success'),
                      borderWidth: 2,
                      data: randomSevenElementsChartData1,
                    },
                    {
                      label: 'Marl-E CMS in Government',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-danger'),
                      pointHoverBackgroundColor: getStyle('--cui-danger'),
                      borderWidth: 2,
                      // borderDash: [8, 5],
                      data: [65, 65, 65, 65, 65, 65, 65],
                    },
                    {
                      label: 'Marl-E CMS 개발 인력 재검토',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-danger'),
                      pointHoverBackgroundColor: getStyle('--cui-success'),
                      borderWidth: 2,
                      data: randomSevenElementsChartData2,
                    },
                    {
                      label: 'Marl-E CMS SI 파견 검토',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-gray'),
                      pointHoverBackgroundColor: getStyle('--cui-success'),
                      borderWidth: 2,
                      data: randomSevenElementsChartData3,
                    },
                    {
                      label: 'Average',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-gray'),
                      pointHoverBackgroundColor: getStyle('--cui-success'),
                      borderWidth: 2,
                      borderDash: [8, 5],
                      data: [125, 125, 125, 125, 125, 125, 125],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                    y: {
                      ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                        max: 250,
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                      hoverBorderWidth: 3,
                    },
                  },
                }}
              />
            </CCardBody>
            <CCardFooter>
              <CRow className="d-inline-block justify-content-center mb-1">
                <h5 className="d-inline">핫콘 순위</h5>
                <small className="text-medium-emphasis d-inline">
                  클릭 시 해당 문서의 상세 정보 창으로 이동합니다.
                </small>
              </CRow>
              <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
                {hotDocTopFive.map((item, index) => (
                  <CCol className="mb-sm-2 mb-0 d-flex flex-column" key={index}>
                    <strong>{index + 1}위</strong>
                    <CPopover content={item.name} placement="bottom" trigger="hover">
                      <div className="text-medium-emphasis mb-3 text-truncate">{item.name}</div>
                    </CPopover>
                    <div className="mt-auto mb-0">
                      <strong>{item.value} 개</strong>
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCardFooter>
          </CCard>

          {/* 핫독 랭크 E -----------------------------------------------------*/}
        </CCol>
        <CCol sm={6}>
          <CCard className="m-3">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="TokenUsage" className="card-title mb-0">
                    전체 토큰 사용량 추이
                  </h4>
                  <div className="small text-medium-emphasis">January - July 2021</div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButtonGroup className="float-end me-3">
                    {['days', 'months'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        active={value === totalTokenUsageChartLabelOption}
                        onClick={() => setTotalTokenUsageChartLabelOption(value)}
                      >
                        {value === 'days' ? '지난 7일' : '지난 6개월'}{' '}
                      </CButton>
                    ))}
                  </CButtonGroup>
                </CCol>
              </CRow>
              <CChartLine
                style={{ height: '300px', marginTop: '40px' }}
                data={{
                  labels: totalTokenUsageChartLabelOption === 'days' ? weeklyLabel : monthlyLabel,
                  datasets: [
                    {
                      label: 'Total',
                      backgroundColor: hexToRgba(getStyle('--cui-success'), 10),
                      borderColor: getStyle('--cui-success'),
                      pointHoverBackgroundColor: getStyle('--cui-success'),
                      borderWidth: 2,
                      data: totalChartDataInTotalTokenUsage,
                      fill: true,
                    },
                    {
                      label: 'Input Tokens',
                      backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                      borderColor: getStyle('--cui-info'),
                      pointHoverBackgroundColor: getStyle('--cui-info'),
                      borderWidth: 2,
                      data: randomInputTokenChartData,
                      fill: true,
                    },
                    {
                      label: 'Output Tokens',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-warning'),
                      pointHoverBackgroundColor: getStyle('--cui-warning'),
                      borderWidth: 2,
                      data: randomOutputTokenChartData,
                    },
                    {
                      label: 'Maximum Token Usage',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-danger'),
                      pointHoverBackgroundColor: getStyle('--cui-danger'),
                      borderWidth: 1,
                      borderDash: [8, 5],
                      data: [380, 380, 380, 380, 380, 380, 380],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                    y: {
                      ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                        max: 300,
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                      hoverBorderWidth: 3,
                    },
                  },
                }}
              />
            </CCardBody>
            <CCardFooter>
              <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
                {tokenUsagesData.map((item, index) => (
                  <CCol className="mb-sm-2 mb-0" key={index}>
                    <div className="text-medium-emphasis">{item.title}</div>
                    <strong>
                      {item.value}
                      <br />({item.percent}%)
                    </strong>
                    <CProgress thin className="mt-2" color={`${item.color}-gradient`} value={item.percent} />
                  </CCol>
                ))}
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={5}>
          <CCard className="m-3">
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
                <CTable align="middle" className="mb-0 border" hover responsive="lg" style={{ height: '430px' }}>
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

                      {standardContractDocumentTableVisible && (
                        <CTableHeaderCell>
                          <CCollapse visible={standardContractDocumentTableVisible} horizontal></CCollapse>
                        </CTableHeaderCell>
                      )}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {standardContractsExample.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          {item.displayName.name.length > 10 ? (
                            <CPopover content={item.displayName.name} placement="bottom" trigger="hover" delay={300}>
                              <div
                                className="overflow-hidden text-truncate"
                                style={{
                                  maxWidth: '9.7rem',
                                }}
                              >
                                {item.displayName.name}
                              </div>
                            </CPopover>
                          ) : (
                            <div
                              className="overflow-hidden text-truncate"
                              style={{
                                maxWidth: '9.7rem',
                              }}
                            >
                              {item.displayName.name}
                            </div>
                          )}
                          <div className="small text-medium-emphasis text-nowrap">
                            Registered: {item.displayName.registered}
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                            <div className="fw-semibold text-nowrap align-middle">{item.usage} 개</div>
                          </CCollapse>
                        </CTableDataCell>

                        {standardContractDocumentTableVisible && (
                          <CTableDataCell>
                            <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                              <CIcon
                                style={{ cursor: 'pointer' }}
                                icon={cilExternalLink}
                                //REMIND ID 파라미터 추가해서 해당 문서 보여주도록 수정
                                onClick={() => navigate('/document-collections/management')}
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
                <CTable align="middle" className="mb-0 border me-2" hover responsive={'lg'} style={{ height: '430px' }}>
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

                      {newContractDocumentTableVisible && (
                        <CTableHeaderCell>
                          <CCollapse visible={newContractDocumentTableVisible} horizontal></CCollapse>
                        </CTableHeaderCell>
                      )}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {DocsExample.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          {item.displayName.name.length > 10 ? (
                            <CPopover content={item.displayName.name} placement="bottom" trigger="hover" delay={300}>
                              <div
                                className="overflow-hidden text-truncate"
                                style={{
                                  maxWidth: '9.7rem',
                                }}
                              >
                                {item.displayName.name}
                              </div>
                            </CPopover>
                          ) : (
                            <div
                              className="overflow-hidden text-truncate"
                              style={{
                                maxWidth: '9.7rem',
                              }}
                            >
                              {item.displayName.name}
                            </div>
                          )}
                          <div className="small text-medium-emphasis text-nowrap">
                            Registered: {item.displayName.registered}
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CCollapse visible={newContractDocumentTableVisible} horizontal>
                            <div className="collapsable-table-data">
                              <div className="small text-medium-emphasis">New</div>
                              <div className="fw-semibold text-nowrap">{item.activity}</div>
                            </div>
                          </CCollapse>
                        </CTableDataCell>
                        {newContractDocumentTableVisible && (
                          <CTableDataCell>
                            <CCollapse visible={newContractDocumentTableVisible} horizontal>
                              <CIcon
                                style={{ cursor: 'pointer' }}
                                icon={cilExternalLink}
                                //REMIND ID 파라미터 추가해서 해당 문서 보여주도록 수정
                                onClick={() => navigate('/standard-contract/management')}
                              />
                            </CCollapse>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={7}>
          {/* 채팅 통계 정보 S*/}
          <CCard className="m-3">
            <CCardHeader className="d-flex align-items-center justify-content-between bold">
              최근 좋아요 표시된 답변
              <small className="text-medium-emphasis"> 질문 클릭 시 해당 답변을 볼 수 있습니다.</small>
            </CCardHeader>
            <CCardBody>
              <CSmartTable
                items={ChatExample}
                pagination={true}
                columns={[
                  {
                    key: 'documentCollection',
                    label: <CIcon icon={cilBook} />,
                    _style: { width: '10%' },
                    _props: { className: 'text-center' },
                    filter: false,
                    sorter: false,
                  },
                  { key: 'question', label: '질문', _props: { className: 'text-nowrap' }, _style: { width: '30%' } },
                  { key: 'modelName', label: 'Model', _style: { width: '20%' } },

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
                  documentCollection: (item) => <td className="text-center">{item.documentCollection}</td>,
                  question: (item, index) => (
                    <CPopover
                      title={
                        <>
                          <CRow className="">
                            <CCol sm={4} className="d-flex align-items-end">
                              <h6 id="answer">답변</h6>
                            </CCol>
                            <CCol sm={8} className="d-flex align-content-center justify-content-end">
                              <CBadge color={'info'} id="modelName" className="m-2 text-center align-content-center">
                                {item.modelName}
                              </CBadge>
                              <CBadge color={'primary'} id="pilotMode" className="m-2">
                                {item.pilotMode === 'C' ? 'Co-pilot' : 'Auto-pilot'}
                              </CBadge>
                              <CBadge id="thumb" className="m-2" style={{ backgroundColor: '#3f66fc' }}>
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
                        <CPopover content={item.question} placement="top" trigger="hover" delay={300}>
                          <div
                            className="overflow-hidden text-truncate"
                            style={{
                              maxWidth: '12rem',
                              overflowY: 'hidden',
                            }}
                          >
                            {item.question}
                          </div>
                        </CPopover>
                      </td>
                    </CPopover>
                  ),
                  pilotMode: (item) => (
                    <td className="text-center">
                      <CIcon icon={item.pilotMode === 'A' ? cilScreenDesktop : cilUser} />
                    </td>
                  ),
                  createdAt: (item) => (
                    <td className="text-center">
                      <div className="text-medium-emphasis text-nowrap">{item.createdAt}</div>
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

          <CCard className="m-3">
            <CCardHeader>6월(이번달) 예상 결제 금액</CCardHeader>
            <CCardBody style={{ paddingBottom: 0 }}>
              <CRow>
                <CCol sm={6}>
                  <CWidgetStatsA
                    style={{ height: '90%', backgroundColor: '#ffd700' }}
                    className="mb-4"
                    value={
                      <span className="text-white">
                        $9,000
                        <span className="fs-6 fw-normal text-white">
                          (10.9% <CIcon icon={cilArrowTop} />)
                        </span>
                      </span>
                    }
                    title={<span className="text-white">6월(이번달) 결제 금액</span>}
                    action={
                      <CDropdown alignment="end">
                        <CDropdownToggle color="transparent" caret={false} className="p-0">
                          <CIcon icon={cilOptions} className="text-white" />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem>Action</CDropdownItem>
                          <CDropdownItem>Another action</CDropdownItem>
                          <CDropdownItem>Something else here...</CDropdownItem>
                          <CDropdownItem disabled>Disabled action</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    }
                    chart={
                      <CChartLine
                        className="mt-3 mx-3"
                        style={{ height: '70px' }}
                        data={{
                          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                          datasets: [
                            {
                              label: 'My First dataset',
                              backgroundColor: 'transparent',
                              borderColor: 'rgba(255,255,255,.55)',
                              pointBackgroundColor: 'white',
                              data: [65, 59, 40, 70, 84, 87],
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          maintainAspectRatio: false,
                          scales: {
                            x: {
                              border: {
                                display: false,
                              },
                              grid: {
                                display: false,
                                drawBorder: false,
                              },
                              ticks: {
                                display: false,
                              },
                            },
                            y: {
                              min: 30,
                              max: 100,
                              display: false,
                              grid: {
                                display: false,
                              },
                              ticks: {
                                display: false,
                              },
                            },
                          },
                          elements: {
                            line: {
                              borderWidth: 5,
                              tension: 0.4,
                            },
                            point: {
                              radius: 4,
                              hitRadius: 10,
                              hoverRadius: 4,
                            },
                          },
                        }}
                      />
                    }
                  />
                </CCol>
                <CCol sm={6}>
                  {/*REMIND 사용률에 따른 색 변화 구현*/}
                  <CWidgetStatsB
                    className="mb-3"
                    color="success"
                    inverse
                    progress={{ value: 89.9 }}
                    text="쓸만큼 쓰셨군요! 다음달에도 만나요~"
                    title="Rate of CMS operation"
                    value="89.9%"
                    style={{ height: '90%' }}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} md={6} xl={6}>
          <CCard className="m-3">
            <CCardHeader className="bold">Daily Token Usage Ratio</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3">
                    <div className="text-medium-emphasis small">Input Tokens</div>
                    <div className="fs-5 fw-semibold">913</div>
                  </div>
                </CCol>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                    <div className="text-medium-emphasis small">Output Tokens</div>
                    <div className="fs-5 fw-semibold">2643</div>
                  </div>
                </CCol>
              </CRow>
              <CProgress height={30}>
                <CProgressBar color="primary" value={25}>
                  25%
                </CProgressBar>
                <CProgressBar color="danger" value={75}>
                  75%
                </CProgressBar>
              </CProgress>

              <hr className="mt-3" />
              <DailyTokenUsagesExampleBarChart />
              <hr className="mt-3" />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6} xl={6}>
          <CCard className="m-3">
            <CCardHeader className="bold">Pop-Model</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                    <div className="text-medium-emphasis small">Popular Pilot Mode</div>
                    <div className="fs-5 fw-semibold">Auto</div>
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

              {popularPilotModeExample.map((item, index) => (
                <div className="progress-group mb-4" key={index}>
                  <div className="progress-group-header">
                    <CIcon className="me-2" icon={item.icon} size="lg" />
                    <span>{item.title}</span>
                    <span className="ms-auto fw-semibold">{item.value}%</span>
                  </div>
                  <div className="progress-group-bars">
                    <CProgress thin color="warning-gradient" value={item.value} />
                  </div>
                </div>
              ))}

              <div className="mb-5"></div>

              {popularModelExample.map((item, index) => (
                <div className="progress-group" key={index}>
                  <div className="progress-group-header">
                    <CIcon className="me-2" icon={item.icon} size="lg" />
                    <span>{item.title}</span>
                    <span className="ms-auto fw-semibold">
                      {item.value} <span className="text-medium-emphasis small">({item.percent}%)</span>
                    </span>
                  </div>
                  <div className="progress-group-bars">
                    <CProgress thin color="success-gradient" value={item.percent} />
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard className="m-3">
        <CCardHeader className="bold">
          <h2>✨ Flexers 😎</h2>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center">
                  <CIcon icon={cilPeople} />
                </CTableHeaderCell>
                <CTableHeaderCell>사용자</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Team</CTableHeaderCell>
                <CTableHeaderCell>
                  토큰 사용량 <small> (단위 : 1000개) </small>
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center">AI Model</CTableHeaderCell>
                <CTableHeaderCell>최근 로그인</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {flexerExample.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={index}>
                  <CTableDataCell className="text-center">
                    <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.user.name}</div>
                    <div className="small text-medium-emphasis text-nowrap">
                      <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered: {item.user.registered}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {/*<CIcon size="xl" icon={item.country.flag} title={item.country.name} />*/}
                    <div>{item.team}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex justify-content-between">
                      <div className="float-start">
                        <strong>{item.usage.value} </strong>
                      </div>
                      {/*<div className="float-end ms-1 text-nowrap">*/}
                      {/*  <small className="text-medium-emphasis">{item.usage.period}</small>*/}
                      {/*</div>*/}
                    </div>
                    {/*<CProgress thin color={`${item.usage.color}-gradient`} value={item.usage.value} />*/}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CIcon size="xl" icon={item.payment.icon} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="small text-medium-emphasis">Last login</div>
                    <div className="fw-semibold text-nowrap">{item.activity}</div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default DashboardPage;
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomInputTokenChartData = [
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
];
const randomOutputTokenChartData = [
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
];

const randomSevenElementsChartData1 = [
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
];

const randomSevenElementsChartData2 = [
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
];

const randomSevenElementsChartData3 = [
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
];

const randomSevenElementsChartData = [
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
  random(50, 200),
];

const monthlyLabel = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const weeklyLabel = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const totalChartDataInTotalTokenUsage = mergeAndSumArrays(randomInputTokenChartData, randomOutputTokenChartData);

const dailyTokenUsagesExample = [
  { title: 'Monday', InputTokens: 34, OutputTokens: 78 },
  { title: 'Tuesday', InputTokens: 56, OutputTokens: 94 },
  { title: 'Wednesday', InputTokens: 12, OutputTokens: 67 },
  { title: 'Thursday', InputTokens: 43, OutputTokens: 91 },
  { title: 'Friday', InputTokens: 22, OutputTokens: 73 },
  { title: 'Saturday', InputTokens: 53, OutputTokens: 82 },
  { title: 'Sunday', InputTokens: 9, OutputTokens: 69 },
];
const dailyTokenUsagesExampleLabels = dailyTokenUsagesExample.map((item) => item.title);
const dailyTokenUsagesExampleInputToken = dailyTokenUsagesExample.map((item) => item.InputTokens);
const dailyTokenUsagesExampleOutputToken = dailyTokenUsagesExample.map((item) => item.OutputTokens);
const DailyTokenUsagesExampleBarChart = () => {
  //REMIND 매일 차트 라벨 변경해서, 가장 마지막 요일이 오늘이 되도록
  return (
    <CChart
      type="bar"
      data={{
        labels: dailyTokenUsagesExampleLabels,
        datasets: [
          {
            label: 'Input Tokens',
            backgroundColor: '#007bff',
            data: dailyTokenUsagesExampleInputToken,
          },
          {
            label: 'Output Tokens',
            backgroundColor: '#dc3545',
            data: dailyTokenUsagesExampleOutputToken,
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            labels: {
              color: getStyle('--cui-body-color'),
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
          y: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
        },
      }}
    />
  );
};
