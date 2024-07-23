import React from 'react';

import { CChart } from '@coreui/react-chartjs';
import { CCard, CCardBody, CCardHeader, CCol, CProgress, CProgressBar, CRow } from '@coreui/react-pro';
import { getStyle } from '@coreui/utils';
import { getUpdatedWeeklyLabel } from 'components/chart/ChartLabel';
import { padDataArrayWithZeroForDay, totalTokenUsagePaddingObject } from 'utils/chart/ChartStatisticsProcessor';
import { sortByPropertyKeyForDay } from 'utils/chart/sortByPropertyKeyForMonth';

const weeklyLabel = getUpdatedWeeklyLabel();

export const DailyTokenUsageChart = ({ data = [] }) => {
  const paddedDailyChartData = padDataArrayWithZeroForDay(data, 'name', totalTokenUsagePaddingObject);
  const sortedDailyChartData = sortByPropertyKeyForDay(paddedDailyChartData, 'name');
  const totalInputTokens = sortedDailyChartData.map((data) => data.metadata.total_input_tokens);
  const totalOutputTokens = sortedDailyChartData.map((data) => data.metadata.total_output_tokens);
  const inputOfToday = totalInputTokens[totalInputTokens.length - 1];
  const outputOfToday = totalOutputTokens[totalOutputTokens.length - 1];
  const totalOfToday = inputOfToday + outputOfToday || -1;
  const renderChart = () => (
    <CChart
      type="bar"
      data={{
        labels: weeklyLabel,
        datasets: [
          {
            label: 'Input Tokens',
            backgroundColor: '#007bff',
            data: totalInputTokens,
          },
          {
            label: 'Output Tokens',
            backgroundColor: '#dc3545',
            data: totalOutputTokens,
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

  return (
    <CCard className="m-3">
      <CCardHeader className="bold">Daily Token Usage Ratio</CCardHeader>
      <CCardBody>
        <CRow>
          <CCol sm={6}>
            <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3">
              <div className="text-medium-emphasis small">Input Tokens</div>
              <div className="fs-5 fw-semibold">{inputOfToday}</div>
            </div>
          </CCol>
          <CCol sm={6}>
            <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
              <div className="text-medium-emphasis small">Output Tokens</div>
              <div className="fs-5 fw-semibold">{outputOfToday}</div>
            </div>
          </CCol>
        </CRow>
        <CProgress height={30}>
          <CProgressBar color="primary" value={parseInt(((inputOfToday / totalOfToday) * 100).toFixed(0))}>
            {`${((inputOfToday / totalOfToday) * 100).toFixed(1)}%`}
          </CProgressBar>
          <CProgressBar color="danger" value={parseInt(((outputOfToday / totalOfToday) * 100).toFixed(0))}>
            {`${((outputOfToday / totalOfToday) * 100).toFixed(1)}%`}
          </CProgressBar>
          {totalOfToday === -1 && (
            <CProgressBar color="secondary" value={100}>
              {'No Data'}
            </CProgressBar>
          )}
        </CProgress>

        <hr className="mt-3" />
        {renderChart()}
        <hr className="mt-3" />
      </CCardBody>
    </CCard>
  );
};
