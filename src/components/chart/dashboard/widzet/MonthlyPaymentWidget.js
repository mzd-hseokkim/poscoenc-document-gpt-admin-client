import React from 'react';

import { cilArrowTop, cilOptions } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CChartLine } from '@coreui/react-chartjs';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CWidgetStatsA } from '@coreui/react-pro';

export const MonthlyPaymentWidget = () => {
  return (
    <CWidgetStatsA
      style={{ height: '90%', backgroundColor: '#ffd700' }}
      className="mb-3"
      value={
        <span className="text-white">
          $9,000
          <span className="fs-6 fw-normal text-white">
            (10.9% <CIcon icon={cilArrowTop} />)
          </span>
        </span>
      }
      title={<span className="text-white">6월(이번달) 결제 금액</span>}
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
          style={{ height: '70px' }}
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)',
                pointBackgroundColor: 'white',
                data: [65, 59, 40, 70, 84, 87],
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
                min: 30,
                max: 100,
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
                borderWidth: 5,
                tension: 0.4,
              },
              point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }}
        />
      }
    />
  );
};
