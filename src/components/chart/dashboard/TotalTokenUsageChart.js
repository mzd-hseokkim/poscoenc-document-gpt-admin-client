import React, { useCallback, useEffect, useState } from 'react';

import { CChartLine } from '@coreui/react-chartjs';
import { CButton, CButtonGroup, CCard, CCardBody, CCardFooter, CCol, CProgress, CRow } from '@coreui/react-pro';
import { getStyle } from '@coreui/utils';
import { getLastSixMonthsLabel, getUpdatedWeeklyLabel } from 'components/chart/ChartLabel';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import {
  findPaddedMaxMin,
  mergeAndSumArrays,
  padDataArrayWithZeroForDay,
  padDataArrayWithZeroForMonth,
  totalTokenUsagePaddingObject,
} from 'utils/chart/ChartStatisticsProcessor';
import { sortByPropertyKeyForDay, sortByPropertyKeyForMonth } from 'utils/chart/sortByPropertyKeyForMonth';

const lastSixMonthLabel = getLastSixMonthsLabel();
const weeklyLabel = getUpdatedWeeklyLabel();

//REMIND Bing search, Dalle3 useage 는 반영하지 않았음. 추후 필요에 따라 구현해야함.
export const TotalTokenUsageChart = ({ isLoading, monthlyChartData = [], dailyChartData = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    labelOption: 'months',
    monthlyData: {
      labels: [],
      totalUsages: [],
      inputTokens: [],
      outputTokens: [],
      max: 0,
      min: 0,
      accumulatedInput: 0,
      accumulatedOutput: 0,
      accumulatedTotal: 0,
    },
    dailyData: {
      labels: [],
      totalUsages: [],
      inputTokens: [],
      outputTokens: [],
      max: 0,
      min: 0,
      accumulatedInput: 0,
      accumulatedOutput: 0,
      accumulatedTotal: 0,
    },
  });

  const prepareMonthlyData = useCallback(() => {
    const paddedMonthlyChartData = padDataArrayWithZeroForMonth(
      monthlyChartData,
      new Date().getMonth() + 1,
      12,
      'name',
      totalTokenUsagePaddingObject
    );
    const sortedMonthlyChartData = sortByPropertyKeyForMonth(paddedMonthlyChartData, 'name');
    const lastSixMonthsChartData = sortedMonthlyChartData.slice(6, 12);
    const { paddedMax, paddedMin } = findPaddedMaxMin(lastSixMonthsChartData);
    const totalInputTokens = lastSixMonthsChartData.map((data) => data.metadata.total_input_tokens);
    const totalOutputTokens = lastSixMonthsChartData.map((data) => data.metadata.total_output_tokens);
    const totalUsages = mergeAndSumArrays(totalInputTokens, totalOutputTokens);
    const accumulatedInput = totalInputTokens.reduce((acc, value) => acc + value, 0);
    const accumulatedOutput = totalOutputTokens.reduce((acc, value) => acc + value, 0);
    const accumulatedTotal = accumulatedInput + accumulatedOutput;

    return {
      labels: lastSixMonthLabel,
      totalUsages,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      max: paddedMax,
      min: paddedMin,
      accumulatedInput,
      accumulatedOutput,
      accumulatedTotal,
    };
  }, [monthlyChartData]);

  const prepareDailyData = useCallback(() => {
    const paddedDailyChartData = padDataArrayWithZeroForDay(dailyChartData, 'name', totalTokenUsagePaddingObject);
    const sortedDailyChartData = sortByPropertyKeyForDay(paddedDailyChartData, 'name');
    const { paddedMax, paddedMin } = findPaddedMaxMin(sortedDailyChartData);
    const totalInputTokens = sortedDailyChartData.map((data) => data.metadata.total_input_tokens);
    const totalOutputTokens = sortedDailyChartData.map((data) => data.metadata.total_output_tokens);
    const totalUsages = mergeAndSumArrays(totalInputTokens, totalOutputTokens);
    const accumulatedInput = totalInputTokens.reduce((acc, value) => acc + value, 0);
    const accumulatedOutput = totalOutputTokens.reduce((acc, value) => acc + value, 0);
    const accumulatedTotal = accumulatedInput + accumulatedOutput;

    return {
      labels: weeklyLabel,
      totalUsages,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      max: paddedMax,
      min: paddedMin,
      accumulatedInput,
      accumulatedOutput,
      accumulatedTotal,
    };
  }, [dailyChartData]);

  useEffect(() => {
    const monthlyData = prepareMonthlyData();
    const dailyData = prepareDailyData();
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      monthlyData,
      dailyData,
    }));
  }, [prepareDailyData, prepareMonthlyData]);

  const updateChartOption = (labelOption) => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      labelOption,
    }));
  };

  const currentData = chartOptions.labelOption === 'days' ? chartOptions.dailyData : chartOptions.monthlyData;

  const tokenUsagesData = [
    {
      title: 'Total',
      value: currentData.accumulatedTotal,
      percent: 100,
      color: 'success',
    },
    {
      title: 'Input Tokens',
      value: currentData.accumulatedInput,
      percent: parseInt(((currentData.accumulatedInput / currentData.accumulatedTotal) * 100).toFixed(0)),
      color: 'info',
    },
    {
      title: 'Output Tokens',
      value: currentData.accumulatedOutput,
      percent: parseInt(((currentData.accumulatedOutput / currentData.accumulatedTotal) * 100).toFixed(0)),
      color: 'warning',
    },
    {
      title: 'Remaining',
      value: chartOptions.labelOption === 'days' ? '75,000' : '300,000',
      percent: parseInt(
        ((1 - currentData.accumulatedTotal / (chartOptions.labelOption === 'days' ? 75000 : 3000000)) * 100).toFixed(1)
      ),
      color: 'danger',
    },
  ];

  const renderChart = () => (
    <CChartLine
      style={{ height: '300px', marginTop: '40px' }}
      customTooltips={false}
      data={{
        labels: currentData.labels,
        datasets: [
          {
            label: 'Input Tokens',
            backgroundColor: getStyle('--cui-info'),
            borderColor: getStyle('--cui-info'),
            pointHoverBackgroundColor: getStyle('--cui-info'),
            borderWidth: 2,
            data: currentData.inputTokens,
          },
          {
            label: 'Output Tokens',
            backgroundColor: getStyle('--cui-warning'),
            borderColor: getStyle('--cui-warning'),
            pointHoverBackgroundColor: getStyle('--cui-warning'),
            borderWidth: 2,
            data: currentData.outputTokens,
          },
          {
            label: 'Total',
            backgroundColor: getStyle('--cui-success'),
            borderColor: getStyle('--cui-success'),
            pointHoverBackgroundColor: getStyle('--cui-success'),
            borderWidth: 2,
            data: currentData.totalUsages,
          },
          {
            label: 'Maximum Token Usage',
            backgroundColor: getStyle('--cui-danger'),
            borderColor: getStyle('--cui-danger'),
            pointHoverBackgroundColor: getStyle('--cui-danger'),
            borderWidth: 1,
            borderDash: [8, 5],
            data:
              //REMIND 잔여 토큰 수 렌더링 확정되면 조정 필요
              chartOptions.labelOption === 'days'
                ? [5000, 5000, 5000, 5000, 5000, 5000, 5000]
                : [30000, 30000, 30000, 30000, 30000, 30000, 30000],
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
              min: currentData.min,
              max: currentData.max,
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
        <FormLoadingCover isLoading={isLoading} />
        <CRow>
          <CCol sm={5}>
            <h4 id="TokenUsage" className="card-title mb-0">
              전체 토큰 사용량 추이
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
                  active={value === chartOptions.labelOption}
                  onClick={() => updateChartOption(value)}
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
          <h5>{chartOptions.labelOption === 'days' ? '이번 주 사용량' : '이번 달 사용량'}</h5>
        </CRow>
        <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
          {tokenUsagesData.map((item, index) => (
            <CCol className="mb-sm-2 mb-0" key={index}>
              <div className="text-medium-emphasis">{item.title}</div>
              <strong>
                {item.value}
                <br />({item.percent || 0}%)
              </strong>
              <CProgress thin className="mt-2" color={`${item.color}-gradient`} value={item.percent} />
            </CCol>
          ))}
        </CRow>
      </CCardFooter>
    </CCard>
  );
};
