import React from 'react';

import { cilArrowBottom, cilOptions } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChartLine } from '@coreui/react-chartjs';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CWidgetStatsA } from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { findPaddedMaxMin, padDataArrayWithZeroForMonth } from 'utils/chart/ChartStatisticsProcessor';

const zeroObject = {};
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
  const { paddedMonthlyMax, paddedDailyMin } = findPaddedMaxMin(paddedMonthlyChartData);
  return (
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
        <>
          <FormLoadingCover isLoading={isLoading} />
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
        </>
      }
    />
  );
};
