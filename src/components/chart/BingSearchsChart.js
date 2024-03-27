import React from 'react';

import { cilArrowTop, cilOptions } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChartLine } from '@coreui/react-chartjs';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CWidgetStatsA } from '@coreui/react-pro';
import chartPastYearMonthsLabels from 'components/chart/chartPastYearMonthsLabels';
import { getNonGridLineChartOptions } from 'components/chart/options/getNonGridLineChartOptions';

export const BingSearchsChart = (statisticsData) => {
  return (
    <CWidgetStatsA
      className="mb-3"
      color="info"
      value={
        <>
          {'19회 '}
          <span className="fs-6 fw-normal">
            {/*REMIND 수치 api 데이터로 변경*/}
            (월간, 전월 대비 40.9% <CIcon icon={cilArrowTop} />)
          </span>
        </>
      }
      //REMIND 검색 조건에 따른 criteria 조건도 표시 할 수 있도록 변경
      title="Bing 검색 횟수"
      action={
        //REMIND 통계 기준 변경 dropdown 으로 변경
        <CDropdown alignment="end">
          <CDropdownToggle color="transparent" caret={false} className="p-0">
            <CIcon icon={cilOptions} className="text-white" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>금일(사용자 기준)</CDropdownItem>
            <CDropdownItem>금일(문서 집합 기준)</CDropdownItem>
            <CDropdownItem>월간(사용자 기준)</CDropdownItem>
            <CDropdownItem>월간(문서 집합 기준)</CDropdownItem>
            <CDropdownItem>연간(사용자 기준)</CDropdownItem>
            <CDropdownItem>연간(문서 집합 기준)</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      }
      chart={
        <CChartLine
          className="mt-3 mx-3"
          style={{ height: '80px' }}
          data={{
            labels: chartPastYearMonthsLabels(),
            datasets: [
              {
                label: 'Bing 검색 횟수',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)',
                pointBackgroundColor: '#e5d746',
                data: statisticsData,
              },
            ],
          }}
          /*REMIND 가장 작은 수에서 -10, 가장 큰수에서 +5 인데 +10 으로 하자 */
          options={getNonGridLineChartOptions(40 - 10, 84 + 10)}
        />
      }
    />
  );
};
