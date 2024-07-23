import React from 'react';

import { CCard, CCardBody, CCardHeader, CSmartTable } from '@coreui/react-pro';
import { AIModelIcon } from 'components/icon/AIModelIcon';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import { formatToYMD } from 'utils/common/dateUtils';

export const TopTokenUserList = ({ isLoading, topTokenUsers }) => {
  return (
    <CCard className="m-3">
      <CCardHeader className="bold">
        <h2>✨ Top Token Users 😎</h2>
      </CCardHeader>
      <CCardBody>
        <CSmartTable
          loading={isLoading}
          noItemsLabel={<CSmartTableNoItemLabel defaultMessage="로딩중입니다..." />}
          items={topTokenUsers}
          columns={[
            {
              key: 'name',
              label: '사용자',
              _style: { width: '15%' },
            },
            {
              key: 'team',
              label: '소속',
              _style: { width: '10%', textAlign: 'center' },
            },
            {
              key: 'tokenUsage',
              label: '토큰 사용량',
              _style: { width: '12%', textAlign: 'center' },
            },
            {
              key: 'usedModels',
              label: 'AI Model',
              _style: { width: '10%', textAlign: 'center' },
            },
            {
              key: 'registeredAt',
              label: '가입일',
              _style: { width: '15%', textAlign: 'center' },
            },
          ]}
          scopedColumns={{
            name: (item) => (
              <td>
                <div>{item.name}</div>
                {/*REMIND new 뱃지 구현 <span>{item.user.new ? 'New' : 'Recurring'}</span>*/}
              </td>
            ),
            team: (item) => <td className="text-center">{item.metadata.team}</td>,
            tokenUsage: (item) => <td className="text-center">{item.metadata.tokenUsage}</td>,
            usedModels: (item) => (
              <td>
                <div className="d-flex justify-content-center align-content-center">
                  {item.metadata.usedModels.map((name, index) => (
                    <AIModelIcon key={index} modelName={name} />
                  ))}
                </div>
              </td>
            ),
            registeredAt: (item) => (
              <td>
                <div className="text-medium-emphasis text-nowrap text-center">
                  {formatToYMD(item.metadata.registeredAt)}
                </div>
              </td>
            ),
          }}
          tableProps={{
            align: 'middle',
            className: 'mb-0 border',
            hover: true,
          }}
          tableHeadProps={{
            color: 'secondary',
          }}
        />
      </CCardBody>
    </CCard>
  );
};
