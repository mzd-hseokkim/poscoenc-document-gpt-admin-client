import React from 'react';

import { cilOptions } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChartLine } from '@coreui/react-chartjs';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CWidgetStatsA } from '@coreui/react-pro';
import { getLastSixMonthsLabel } from 'components/chart/ChartLabel';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import {
  calculateAccumulatedGrowthRate,
  calculateCumulativeData,
  findPaddedMaxMin,
  padDataArrayWithZeroForMonth,
  widgetGrowthPaddingObject,
} from 'utils/chart/ChartStatisticsProcessor';

export const MonthlyUserAccountCountWidget = ({ isLoading, totalUserCount, monthlyChartData = [] }) => {
  console.log(monthlyChartData);
  const paddedMonthlyChartData = padDataArrayWithZeroForMonth(
    monthlyChartData,
    new Date().getMonth() + 1,
    6,
    'name',
    widgetGrowthPaddingObject
  ).map((item) => item.value);

  const cumulativeChartData = calculateCumulativeData(totalUserCount, paddedMonthlyChartData);

  const { paddedMax, paddedMin } = findPaddedMaxMin(cumulativeChartData);

  return (
    <CWidgetStatsA
      color="warning"
      value={
        <>
          {`${totalUserCount || 0} 명`}
          <span className="fs-6 fw-normal">
            ({calculateAccumulatedGrowthRate(totalUserCount, paddedMonthlyChartData[5])}, 월간)
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
        <>
          <FormLoadingCover isLoading={isLoading} />
          <CChartLine
            className="mt-3"
            style={{ height: '70px' }}
            data={{
              labels: getLastSixMonthsLabel(),
              datasets: [
                {
                  label: '월별 사용자 누계',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: cumulativeChartData,
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
                  min: paddedMin,
                  max: paddedMax,
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
        </>
      }
    />
  );
};
