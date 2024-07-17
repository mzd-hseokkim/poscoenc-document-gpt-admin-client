import React, { useState } from 'react';

import { CChartLine } from '@coreui/react-chartjs';
import { CButton, CButtonGroup, CCard, CCardBody, CCardFooter, CCol, CPopover, CRow } from '@coreui/react-pro';
import { getStyle } from '@coreui/utils';
import { getLastSixMonthsLabel, getUpdatedWeeklyLabel } from 'components/chart/ChartLabel';
import { padDataArrayWithZeroForDay } from 'utils/chart/ChartStatisticsProcessor';

const lastSixMonthLabel = getLastSixMonthsLabel();
const weeklyLabel = getUpdatedWeeklyLabel();
const hotDocTopFiveColor = ['--cui-primary', '--cui-success', '--cui-info', '--cui-warning', '--cui-danger'];
const topChatDocumentPaddingObject = {
  name: '',
  recordedAt: '',
  value: 0,
  metadata: {},
};
export const DocumentCollectionTopChatChart = ({ chartData = [] }) => {
  const [hotConChartLabelOption, setHotConChartLabelOption] = useState('days');
  console.log(chartData);

  const allTime = chartData?.allTime || [{ id: 0, name: '-', rank: 0, recordedAt: '-', value: 0 }];
  const daily = chartData.daily;
  const monthly = chartData.monthly;

  const sortByCollectionIdForDaily = (data = []) => {
    const collections = {};

    data.forEach((doc) => {
      const docDisplayName = doc.metadata.documentCollectionId;
      if (!collections[docDisplayName]) {
        collections[docDisplayName] = [];
      }
      collections[docDisplayName].push(doc);
    });
    return collections;
  };
  const sortedDailyData = sortByCollectionIdForDaily(daily);
  console.log(sortedDailyData);

  //STARTFROM Name 추가해주고, 누적 top chat 순위먼저 매기기
  const dailyAccumulatedChatCounts = Object.keys(sortedDailyData)
    .map((docId) => {
      const docData = sortedDailyData[docId];
      const accumulation = docData.reduce((acc, data) => {
        return acc + data.value;
      }, 0);
      return {
        id: docId,
        accumulation,
      };
    })
    .sort((a, b) => {
      return b.accumulation - a.accumulation;
    });
  const mapToChartDataForDaily = Object.keys(sortedDailyData).map((docId) => {
    const docData = sortedDailyData[docId];
    const label = docData[0].metadata.documentCollectionDisplayName;
    const paddedData = padDataArrayWithZeroForDay(docData, 'name', topChatDocumentPaddingObject);
    const data = paddedData.map((doc) => doc.value);

    return {
      label,
      backgroundColor: 'transparent',
      //REMIND 색상 정하는 로직은 또 따로 생각해야한다. 일단 데이터 매핑먼저 구현 후 고려
      borderColor: getStyle(hotDocTopFiveColor[docData[0].metadata.rank - 1]),
      pointHoverBackgroundColor: getStyle(hotDocTopFiveColor[docData[0].metadata.rank - 1]),
      borderWidth: 2,
      data,
      fill: true,
    };
  });

  const renderChart = () => (
    <CChartLine
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels: hotConChartLabelOption === 'days' ? weeklyLabel : lastSixMonthLabel,
        datasets: mapToChartDataForDaily,
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
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
  );

  return (
    <CCard className="m-3">
      <CCardBody>
        <CRow>
          <CCol sm={5}>
            <h4 id="HotCon" className="card-title mb-0">
              🔥Hot🔥 Con TOP 5
            </h4>
            <div className="small text-medium-emphasis">
              {`
                ${new Date().getFullYear()}
                ${lastSixMonthLabel[0]} - ${lastSixMonthLabel[lastSixMonthLabel.length - 1]}
              `}
            </div>
          </CCol>
          <CCol sm={7} className="d-none d-md-block">
            <CButtonGroup className="float-end me-3">
              {['days', 'months'].map((value) => (
                <CButton
                  autoFocus
                  key={value}
                  color="outline-secondary"
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
        {renderChart()}
      </CCardBody>
      <CCardFooter style={{ height: '9rem' }}>
        <CRow className="d-inline-block justify-content-center mb-1">
          <h5 className="d-inline">누적 Top Chats 순위</h5>
          {/*<small className="text-medium-emphasis d-inline">클릭 시 해당 문서의 상세 정보 창으로 이동합니다.</small>*/}
        </CRow>
        <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
          {dailyAccumulatedChatCounts.map((doc, index) => (
            <CCol className="mb-sm-2 mb-0 d-flex flex-column" key={index}>
              <strong>{index + 1}위</strong>
              <CButton style={{ backgroundColor: getStyle(hotDocTopFiveColor[index]) }} disabled></CButton>
              <CPopover content={doc.name} color={hotDocTopFiveColor[index]} placement="bottom" trigger="hover">
                <div className="text-medium-emphasis mb-3 text-truncate">{doc.name}</div>
              </CPopover>
              <div className="mt-auto mb-0">
                <strong>{doc.accumulation} 개</strong>
              </div>
            </CCol>
          ))}
        </CRow>
      </CCardFooter>
    </CCard>
  );
};
