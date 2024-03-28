import React from 'react';

import { cilArrowTop, cilOptions } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChartLine } from '@coreui/react-chartjs';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CWidgetStatsA } from '@coreui/react-pro';
import chartPastYearMonthsLabels from 'components/chart/chartPastYearMonthsLabels';
import { findMinMax, padDataArrayWithZero } from 'components/chart/ChartStatisticsProcessor';
import { getNonGridLineChartOptions } from 'components/chart/options/getNonGridLineChartOptions';

export const DeprecatedDallE3GenerationChart = (statisticsData) => {
  const paddedArray = padDataArrayWithZero(statisticsData.data);
  const { minData, maxData } = findMinMax(paddedArray);
  return (
    <CWidgetStatsA
      className="mb-3"
      color="dark"
      value={
        <>
          30{'회 '}
          <span className="fs-6 fw-normal">
            (월간, 전월 대비 40.9% <CIcon icon={cilArrowTop} />)
          </span>
        </>
      }
      title="DallE-3 응답 횟수"
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
          style={{ height: '80px' }}
          data={{
            labels: chartPastYearMonthsLabels('noGrid'),
            datasets: [
              {
                label: '응답 횟수',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)',
                pointBackgroundColor: '#bad7f3',
                //REMIND 단위 추가 '1회'
                data: paddedArray,
              },
            ],
          }}
          /*REMIND 가장 작은 수에서 -10, 가장 큰수에서 +5 인데 +10 으로 하자 */
          options={getNonGridLineChartOptions(minData, maxData)}
        />
      }
    />
  );
};
