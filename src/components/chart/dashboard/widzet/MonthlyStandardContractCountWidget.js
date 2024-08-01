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
} from 'utils/chart/ChartStatisticsProcessor';

const zeroObject = {
  name: '',
  value: 0,
  recordedAt: null,
  metadata: {},
};
//REMIND  API 미구현
export const MonthlyStandardContractCountWidget = ({
  isLoading,
  totalStandardContractDocumentCount,
  monthlyChartData = [],
}) => {
  const paddedMonthlyChartData = padDataArrayWithZeroForMonth(
    monthlyChartData,
    new Date().getMonth() + 1,
    6,
    'name',
    zeroObject
  ).map((item) => item.value);
  console.log(paddedMonthlyChartData);
  const calculativeChartData = calculateCumulativeData(totalStandardContractDocumentCount, paddedMonthlyChartData);
  console.log(calculativeChartData, 'scc');
  const { paddedMax, paddedMin } = findPaddedMaxMin(calculativeChartData);

  return (
    <CWidgetStatsA
      color="info"
      value={
        <>
          {`${totalStandardContractDocumentCount || 0} 개`}
          <span className="fs-6 fw-normal">
            ({calculateAccumulatedGrowthRate(totalStandardContractDocumentCount, paddedMonthlyChartData[5])} , 월간)
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
        <>
          <FormLoadingCover isLoading={isLoading} />
          <CChartLine
            className="mt-3 mx-3"
            style={{ height: '70px' }}
            data={{
              labels: getLastSixMonthsLabel(),
              datasets: [
                {
                  label: '월별 표준 문서 누계',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: '#39f',
                  data: calculativeChartData,
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
                  min: paddedMin,
                  max: paddedMax,
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
        </>
      }
    />
  );
};
