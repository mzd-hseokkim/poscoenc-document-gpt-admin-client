import React, { useState } from 'react';

import { CChartLine } from '@coreui/react-chartjs';
import { CButton, CButtonGroup, CCard, CCardBody, CCardFooter, CCol, CPopover, CRow } from '@coreui/react-pro';
import { getStyle } from '@coreui/utils';
import { getLastSixMonthsLabel, getUpdatedWeeklyLabel } from 'components/chart/ChartLabel';
import { padDataArrayWithZeroForDay, padDataArrayWithZeroForMonth } from 'utils/chart/ChartStatisticsProcessor';

const lastSixMonthLabel = getLastSixMonthsLabel();
const weeklyLabel = getUpdatedWeeklyLabel();
const hotDocTopFiveColor = ['--cui-primary', '--cui-success', '--cui-info', '--cui-warning', '--cui-danger'];
const defaultColor = '--cui-secondary';

const topChatDocumentPaddingObject = {
  name: '',
  recordedAt: '',
  value: 0,
  metadata: {},
};

export const DocumentCollectionTopChatChart = ({ chartData = [] }) => {
  const [hotConChartLabelOption, setHotConChartLabelOption] = useState('days');

  const allTime = chartData?.allTime || [{ id: 0, name: '-', rank: 0, recordedAt: '-', value: 0 }];
  const daily = chartData?.daily;
  const monthly = chartData?.monthly;

  const sortByCollectionId = (data = []) => {
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

  const sortedDailyData = sortByCollectionId(daily);
  const sortedMonthlyData = sortByCollectionId(monthly);

  const dailyColorMapping = {};
  const monthlyColorMapping = {};

  const getDocumentColor = (docIdInt, rank, period) => {
    let color = hotDocTopFiveColor[rank - 1] || defaultColor;
    if (period === 'daily') {
      dailyColorMapping[docIdInt] = color;
    } else if (period === 'monthly') {
      monthlyColorMapping[docIdInt] = color;
    }
    return color;
  };
  const mapToChartData = (targetData, period) => {
    return Object.keys(targetData).map((docId) => {
      const docIdInt = parseInt(docId);
      const docData = targetData[docId];
      const label = docData[0].metadata.documentCollectionDisplayName;
      const paddedData =
        period === 'daily'
          ? padDataArrayWithZeroForDay(docData, 'name', topChatDocumentPaddingObject)
          : padDataArrayWithZeroForMonth(docData, new Date().getMonth() + 1, 6, 'name', topChatDocumentPaddingObject);
      const data = paddedData.map((doc) => doc.value);
      //REMIND api 수정 후 [0] 로직 수정
      const docColor = getDocumentColor(docIdInt, docData[0].metadata.rank, period);

      return {
        label,
        borderColor: getStyle(docColor),
        backgroundColor: getStyle(docColor),
        pointHoverBackgroundColor: getStyle(docColor),
        borderWidth: 2,
        data,
      };
    });
  };

  const formattedDailyChartData = mapToChartData(sortedDailyData, 'daily');
  const formattedMonthlyChartData = mapToChartData(sortedMonthlyData, 'monthly');

  const renderChart = () => (
    <CChartLine
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels: hotConChartLabelOption === 'days' ? weeklyLabel : lastSixMonthLabel,
        datasets: hotConChartLabelOption === 'days' ? formattedDailyChartData : formattedMonthlyChartData,
      }}
      customTooltips={false}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
          tooltip: {
            position: 'average',
            mode: 'index',
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
            min: 0,
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
          {allTime.map((doc, index) => {
            const docIdInt = parseInt(doc.id);
            const colorMapping = hotConChartLabelOption === 'days' ? dailyColorMapping : monthlyColorMapping;
            const color = colorMapping[docIdInt] || defaultColor;

            return (
              <CCol className="mb-sm-2 mb-0 d-flex flex-column" key={index}>
                <strong>{doc.rank}위</strong>
                <CPopover
                  content={<strong>{`${doc.name}`}</strong>}
                  color={hotDocTopFiveColor[index]}
                  placement="bottom"
                  trigger="hover"
                >
                  <p
                    className="text-truncate text-white px-2 small"
                    style={{
                      backgroundColor: getStyle(color),
                      borderRadius: '7.5px',
                    }}
                  >
                    {doc.name}
                  </p>
                </CPopover>
                <div className="mt-auto mb-0">
                  <strong className="text-muted">{doc.value} 개</strong>
                </div>
              </CCol>
            );
          })}
        </CRow>
      </CCardFooter>
    </CCard>
  );
};
