import React from 'react';

import { cilArrowTop, cilOptions } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChartLine } from '@coreui/react-chartjs';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CWidgetStatsA } from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';

export const MonthlyUserAccountCountWidget = ({ isLoading, totalUserCount }) => {
  return (
    <>
      <CWidgetStatsA
        color="warning"
        value={
          <>
            {`${totalUserCount || 0} 명`}
            <span className="fs-6 fw-normal">
              (1.9% <CIcon icon={cilArrowTop} />, 월간)
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
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
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
    </>
  );
};
