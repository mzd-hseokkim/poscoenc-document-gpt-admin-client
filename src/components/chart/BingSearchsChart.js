import React from 'react';

import { cibBing, cilOptions } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChart } from '@coreui/react-chartjs';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CWidgetStatsD } from '@coreui/react-pro';
import MonthLabelGenerator from 'components/chart/MonthLabelGenerator';
import { getNonGridLineChartOptions } from 'components/chart/options/getNonGridLineChartOptions';
import { calculateMonthOnMonthGrowthRateWithArrow, findPaddedMaxMin } from 'utils/chart/ChartStatisticsProcessor';

export const BingSearchsChart = ({ statisticsData }) => {
  const { paddedMonthlyMax, paddedDailyMin } = findPaddedMaxMin(statisticsData);
  return (
    <CWidgetStatsD
      className="mb-4"
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
      {...{
        chart: (
          <CChart
            className="position-absolute w-100 h-100"
            type="line"
            data={{
              labels: MonthLabelGenerator.pastYearMonthsChartLabels(),
              datasets: [
                {
                  label: '검색 횟수',
                  backgroundColor: 'rgba(255,255,255,.1)',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  data: statisticsData,
                  fill: true,
                },
              ],
            }}
            options={getNonGridLineChartOptions({
              scales: {
                x: {
                  display: false,
                },
                y: {
                  display: false,
                  min: paddedMin,
                  max: paddedMax,
                },
              },
            })}
          />
        ),
      }}
      icon={<CIcon icon={cibBing} height={52} className="my-4 text-white" />}
      values={[
        { title: 'Bing 검색 횟수', value: `${statisticsData[11]} 회` },
        {
          title: '전월 대비',
          value: calculateMonthOnMonthGrowthRateWithArrow(statisticsData[10], statisticsData[11]),
        },
      ]}
      style={{
        '--cui-card-cap-bg': '#0078d4',
      }}
    />
  );
};
