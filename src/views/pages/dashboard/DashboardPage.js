import React, { useState } from 'react';

import {
  cib500px5,
  cibAdguard,
  cibAdobeAfterEffects,
  cibAirbnb,
  cibAndroidAlt,
  cibAnsible,
  cibCcApplePay,
  cibCcPaypal,
  cibFacebook,
  cibGoogle,
  cibLinkedin,
  cibTwitter,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cilArrowBottom,
  cilArrowTop,
  cilCloudDownload,
  cilDescription,
  cilOptions,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChart, CChartLine } from '@coreui/react-chartjs';
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress,
  CRow,
  CSmartTable,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsA,
} from '@coreui/react-pro';
import { getStyle, hexToRgba } from '@coreui/utils';
import { mergeAndSumArrays } from 'components/chart/utils/ChartStatisticsProcessor';

const DashboardPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const hotDocTopFive = [
    { title: 'Marl-E CMS in POSCO Corp.', value: '29,703 ', color: 'success' },
    { title: 'Marl-E CMS in MZC.', value: '24,093 ', color: 'info' },
    { title: 'Marl-E CMS in Government', value: '78,706 ', color: 'warning' },
    { title: 'Marl-E CMS 개발 인력 재검토', value: '22,123 ', color: 'danger' },
    { title: 'Marl-E CMS SI 파견 검토', value: '22,222 ', color: 'primary' },
  ];

  const tokenUsagesData = [
    { title: 'Tatal Token Usage', value: '102,799 tokens', percent: 100, color: 'success' },
    { title: 'Input Tokens', value: '24,093 tokens', percent: ((24093 / 102799) * 100).toFixed(0), color: 'info' },
    { title: 'Output Tokens', value: '78,706 tokens', percent: ((78706 / 102799) * 100).toFixed(0), color: 'warning' },
    {
      title: 'Maximum Token Usage',
      value: '190.000 tokens',
      percent: ((102799 / 190000) * 100).toFixed(1),
      color: 'danger',
    },
  ];

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
    return (
      <CChart
        type="bar"
        data={{
          labels: dailyTokenUsagesExampleLabels,
          datasets: [
            {
              label: 'Input Tokens',
              backgroundColor: '#007bff', // Blue color for Value 1
              data: dailyTokenUsagesExampleInputToken,
            },
            {
              label: 'Output Tokens',
              backgroundColor: '#dc3545', // Red color for Value 2
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

  const popularPilotModeExample = [
    { title: 'Auto', icon: cilUser, value: 53 },
    { title: 'Co', icon: cilUserFemale, value: 47 },
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
      country: { name: 'USA', flag: cifUs },
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
      country: { name: 'Brazil', flag: cifBr },
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
      country: { name: 'India', flag: cifIn },
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
      country: { name: 'France', flag: cifFr },
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
      country: { name: 'Spain', flag: cifEs },
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
      country: { name: 'Poland', flag: cifPl },
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
      avatar: { src: '/images/logos/marle-logo.png', status: 'success' },
      displayName: {
        name: '계약 문서 1',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cib500px5 },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibGoogle },
      activity: '10 sec ago',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'danger' },
      displayName: {
        name: '계약 문서 2',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cibAdguard },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibGoogle },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'warning' },
      displayName: { name: '계약 문서 6', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'India', flag: cibAdobeAfterEffects },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibGoogle },
      activity: '1 hour ago',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'secondary' },
      displayName: { name: '계약 문서 3', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'France', flag: cibAirbnb },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'success' },
      displayName: {
        name: '계약 문서 4',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Spain', flag: cibAndroidAlt },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibGoogle },
      activity: 'Last week',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'danger' },
      displayName: {
        name: '계약 문서 16',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Poland', flag: cibAnsible },

      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibGoogle },
      activity: 'Last week',
    },
  ];
  const standardContractsExample = [
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'success' },
      displayName: {
        name: '표준 계약 문서 1',
        new: true,
        registered: 'Jan 1, 2021',
      },
      company: { name: 'USA', flag: cib500px5 },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      activity: '10 sec ago',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'danger' },
      displayName: {
        name: '표준 계약 문서 2',
        new: false,
        registered: 'Jan 1, 2021',
      },
      company: { name: 'Brazil', flag: cibAdguard },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'warning' },
      displayName: { name: '표준 계약 문서 6', new: true, registered: 'Jan 1, 2021' },
      company: { name: 'India', flag: cibAdobeAfterEffects },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      activity: '1 hour ago',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'secondary' },
      displayName: { name: '표준 계약 문서 3', new: true, registered: 'Jan 1, 2021' },
      company: { name: 'France', flag: cibAirbnb },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      activity: 'Last month',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'success' },
      displayName: {
        name: '표준 계약 문서 4',
        new: true,
        registered: 'Jan 1, 2021',
      },
      company: { name: 'Spain', flag: cibAndroidAlt },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: '/images/logos/marle-logo.png', status: 'danger' },
      displayName: {
        name: '표준 계약 문서 16',
        new: true,
        registered: 'Jan 1, 2021',
      },
      company: { name: 'Poland', flag: cibAnsible },
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      activity: 'Last week',
    },
  ];

  const ChatExample = [
    {
      // avatar: { src: 'path/to/avatar1.jpg', status: 'success' },
      avatar: { src: '/images/logos/marle-logo.png', status: 'danger' },
      question: `안녕?`,
      // country: { flag: 'cilFlagAlt', name: 'USA' },
      askedAt: '2024-06-12 10:00 AM',
    },
    {
      // avatar: { src: 'path/to/avatar2.jpg', status: 'warning' },
      avatar: { src: '/images/logos/marle-logo.png', status: 'danger' },
      question: `이 계약서의 계약 기간과 계약금액, 배상금에 대한 내용들을 알려줘.`,
      // country: { flag: 'cilFlagAlt', name: 'Canada' },
      askedAt: '2024-06-11 09:00 AM',
    },
    // 더 많은 데이터 추가 가능
  ];
  const AnswerExample = [
    {
      message: '안녕하세요 무엇을 도와드릴까요?',
    },
    {
      message: ' 계약 기간으로는 ........................................',
    },
  ];

  return (
    <div className="d-flex flex-column flex-grow-1 overflow-auto" style={{ width: '100%' }}>
      <CRow className="p-3">
        <CCol sm={4}>
          <CWidgetStatsA
            color="primary"
            value={
              <>
                9,000{'개'}
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
        </CCol>
        <CCol sm={4}>
          <CWidgetStatsA
            color="info"
            value={
              <>
                1,000{'개'}
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
                10,000{'명'}
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
                  <h4 id="HotDoc" className="card-title mb-0">
                    🔥Hot🔥 Doc TOP 5
                  </h4>
                  <div className="small text-medium-emphasis">January - July 2021</div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButton color="primary" className="float-end">
                    <CIcon icon={cilCloudDownload} />
                  </CButton>
                  <CButtonGroup className="float-end me-3">
                    {['주간', '월간'].map((value) => (
                      <CButton color="outline-secondary" key={value} className="mx-0" active={value === '주간'}>
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup>
                </CCol>
              </CRow>
              <CChartLine
                style={{ height: '300px', marginTop: '40px' }}
                data={{
                  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  datasets: [
                    {
                      label: 'Marl-E CMS in POSCO Corp.',
                      // backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-info'),
                      pointHoverBackgroundColor: getStyle('--cui-info'),
                      borderWidth: 2,
                      data: [
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                      ],
                      fill: true,
                    },
                    {
                      label: 'Marl-E CMS in MZC.',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-success'),
                      pointHoverBackgroundColor: getStyle('--cui-success'),
                      borderWidth: 2,
                      data: [
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                      ],
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
                      data: [
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                      ],
                    },
                    {
                      label: 'Marl-E CMS SI 파견 검토',
                      backgroundColor: 'transparent',
                      borderColor: getStyle('--cui-gray'),
                      pointHoverBackgroundColor: getStyle('--cui-success'),
                      borderWidth: 2,
                      data: [
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                      ],
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
                <h5 className="d-inline">핫독 순위</h5>
                <small className="text-medium-emphasis d-inline">
                  {' '}
                  클릭 시 해당 문서의 상세 정보 창으로 이동합니다.
                </small>
              </CRow>
              <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
                {hotDocTopFive.map((item, index) => (
                  <CCol className="mb-sm-2 mb-0 d-flex flex-column" key={index}>
                    <strong>{index + 1}위</strong>
                    <div className="text-medium-emphasis mb-3">{item.title}</div>
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
                  <CButton color="primary" className="float-end">
                    <CIcon icon={cilCloudDownload} />
                  </CButton>
                  <CButtonGroup className="float-end me-3">
                    {['Day', 'Month', 'Year'].map((value) => (
                      <CButton color="outline-secondary" key={value} className="mx-0" active={value === 'Month'}>
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup>
                </CCol>
              </CRow>
              <CChartLine
                style={{ height: '300px', marginTop: '40px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
                      {item.value} ({item.percent}%)
                    </strong>
                    <CProgress thin className="mt-2" color={`${item.color}-gradient`} value={item.percent} />
                  </CCol>
                ))}
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="m-3">
        <CCardHeader>Daily Token Usages {' & '} Popular Model</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={12} md={6} xl={6}>
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
              <hr className="mt-0" />
              {/*{dailyTokenUsagesExample.map((item, index) => (*/}
              {/*  <div className="progress-group mb-4" key={index}>*/}
              {/*    <div className="progress-group-prepend">*/}
              {/*      <span className="text-medium-emphasis small">{item.title}</span>*/}
              {/*    </div>*/}
              {/*    <div className="progress-group-bars">*/}
              {/*      <CProgress thin color="info-gradient" value={item.value1} />*/}
              {/*      <CProgress thin color="danger-gradient" value={item.value2} />*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*))}*/}
              <DailyTokenUsagesExampleBarChart />
            </CCol>

            <CCol xs={12} md={6} xl={6}>
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
            </CCol>
          </CRow>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center">
                  <CIcon icon={cilPeople} />
                </CTableHeaderCell>
                <CTableHeaderCell>사용자</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Country</CTableHeaderCell>
                <CTableHeaderCell>
                  토큰 사용량 <small> (단위 : 1000개) </small>
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center">AI Model</CTableHeaderCell>
                <CTableHeaderCell>최근 활동</CTableHeaderCell>
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
                    <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
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

      <CRow>
        <CCol sm={6}>
          <CCard className="m-3">
            <CCardHeader> NEW Docs! & New Standard Contract Docs</CCardHeader>
            <CCardBody className="d-flex justify-content-center">
              <CTable align="middle" className="mb-0 border me-5" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilDescription} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>DisplayName</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Company</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {DocsExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.displayName.name}</div>
                        <div className="small text-medium-emphasis text-nowrap">
                          <span>{item.displayName.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.displayName.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">CreatedAy</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CTable
                align="middle"
                className="mb-0 border"
                hover
                // style={{ width: '45%' }}
                responsive
              >
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilDescription} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>DisplayName</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Company</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">파생 횟수</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {standardContractsExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.displayName.name}</div>
                        <div className="small text-medium-emphasis text-nowrap">
                          <span>{item.displayName.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.displayName.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.company.flag} title={item.company.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        {/*<div className="small text-medium-emphasis">기용 횟수</div>*/}
                        <div className="fw-semibold text-nowrap">{item.usage.value} 회</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">CreatedAy</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6}>
          {/* 채팅 통계 정보 S*/}
          <CCard className="m-3">
            <CCardHeader>최근 좋아요 표시된 답변</CCardHeader>
            <CCardBody className="d-flex justify-content-center">
              <CSmartTable
                items={ChatExample}
                pagination={true}
                columns={[
                  {
                    key: 'avatar',
                    label: <CIcon icon={cilPeople} />,
                    _style: { width: '33%' },
                    _props: { className: 'text-center' },
                    filter: false,
                    sorter: false,
                    //_cellComponent: ({ item }) => <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />,
                  },
                  { key: 'question', label: '질문', _props: { className: 'text-nowrap' }, _style: { width: '33%' } },

                  // {
                  //   key: 'avatar',
                  //   label: '질문자',
                  //   _style: { width: '10%' },
                  //   _props: { className: 'text-center' },
                  //   filter: false,
                  //   sorter: false,
                  //   // _cellComponent: ({ item }) => <CIcon size="xl" icon={item.country.flag} title={item.country.name} />,
                  // },
                  { key: 'askedAt', label: 'AskedAt', _props: { className: 'text-nowrap' }, _style: { width: '34%' } },
                ]}
                tableProps={{
                  // hover: true,
                  // striped: true,
                  // responsive: true,
                  // align: 'middle',
                  className: 'mb-0 border me-5',
                  style: { width: '90%' },
                  hover: true,
                  responsive: true,
                }}
                scopedColumns={{
                  avatar: (item) => (
                    <td>
                      <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                    </td>
                  ),
                  question: (item, index) => (
                    <td
                      onClick={() => {
                        setHoveredIndex(index);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ overflow: 'auto' }}>{item.question}</div>

                      {/*<div className="small text-medium-emphasis text-nowrap">*/}
                      {/*  <span>{item.displayName.new ? 'New' : 'Recurring'}</span> | Registered:{' '}*/}
                      {/*  {item.displayName.registered}*/}
                      {/*</div>*/}
                    </td>
                  ),
                  askedAt: (item, index) => (
                    <>
                      <td
                        onClick={() => {
                          setHoveredIndex(index);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="small text-medium-emphasis">CreatedAt</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </td>
                      {hoveredIndex === index && (
                        <div
                          style={{
                            position: 'absolute',
                            display: 'flex',
                            width: '4rem',
                            height: 'max-content',
                            borderWidth: '2px',
                            borderColor: 'gray',
                            borderTopRightRadius: '5px',
                            borderBottomRightRadius: '5px',
                            textAlign: 'center',
                            alignContent: 'center',
                          }}
                        >
                          {' >>>>>'}
                        </div>
                      )}
                    </>
                  ),
                }}
                onRowClick={(item, index) => {
                  setHoveredIndex(index);
                  // onClick 이벤트를 여기에 추가하세요.
                  // setChatContent(index);
                }}
              />

              <CCard style={{ width: '45%' }}>
                <CCardHeader> 답변 </CCardHeader>
                <CCardBody>
                  <div>{AnswerExample?.[hoveredIndex]?.message}</div>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
          {/* 채팅 통계 정보 E*/}
        </CCol>
      </CRow>
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
const totalChartDataInTotalTokenUsage = mergeAndSumArrays(randomInputTokenChartData, randomOutputTokenChartData);
