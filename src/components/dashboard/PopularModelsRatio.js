import React from 'react';

import { cilScreenDesktop, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard, CCardBody, CCardHeader, CCol, CProgress, CRow } from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { AIModelIcon } from 'components/icon/AIModelIcon';

const initialAIModels = [
  { name: 'gpt-4o', value: 0, metadata: { rank: 1 } },
  { name: 'mixtral-8x7b-32768', value: 0, metadata: { rank: 2 } },
  { name: 'llama3-70b-8192', value: 0, metadata: { rank: 3 } },
  { name: 'llama3-8b-8192', value: 0, metadata: { rank: 4 } },
  { name: 'claude-3-opus-20240229', value: 0, metadata: { rank: 5 } },
  { name: 'claude-3-sonnet-20240229', value: 0, metadata: { rank: 6 } },
];
export const PopularModelsRatio = ({ isLoading, byPilotMode = [], byModelName = [] }) => {
  // rank 로 정렬한 AI model의 토큰 사용량 총계
  const respondAIModelsUsages = initialAIModels
    .map((model) => {
      const respondModel = byModelName.find((rm) => rm?.name === model.name);
      return respondModel ? { ...model, value: respondModel.value, metadata: respondModel.metadata } : model;
    })
    .sort((a, b) => a.metadata.rank - b.metadata.rank);

  // 모든 Pilot 모드의 토큰 사용량 총계
  const totalTokenUsageCalculatedByPilotMode = byPilotMode.reduce((acc, item) => acc + item.value, 0);

  // 모든 AI Model의 토큰 사용량 총계
  const totalTokenUsageCalculatedByAIModel = respondAIModelsUsages.reduce((acc, item) => acc + item.value, 0);

  return (
    <CCard className="m-3">
      <CCardHeader className="bold">Pop-Model</CCardHeader>
      <CCardBody>
        <FormLoadingCover isLoading={isLoading} />
        <CRow>
          <CCol sm={6}>
            <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
              <div className="text-medium-emphasis small">Popular Pilot Mode</div>
              <div className="fs-5 fw-semibold">
                {byPilotMode.reduce(
                  (maxItem, currentItem) => (currentItem.value > maxItem.value ? currentItem : maxItem),
                  byPilotMode?.[0]?.name
                ) === 'C'
                  ? 'Co'
                  : 'Auto'}
              </div>
            </div>
          </CCol>
          <CCol sm={6}>
            <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
              <div className="text-medium-emphasis small">Popular AI Model</div>
              <div className="fs-5 fw-semibold">GPT-4 Omni</div>
            </div>
          </CCol>
        </CRow>

        <hr className="mt-0" />

        {byPilotMode.map((item, index) => (
          <div className="progress-group mb-4" key={index}>
            <div className="progress-group-header">
              <CIcon className="me-2" icon={item.name === 'C' ? cilUser : cilScreenDesktop} size="lg" />
              <span>{item.name === 'C' ? 'Co' : 'Auto'}</span>
              <span className="ms-auto fw-semibold">
                {((item.value / totalTokenUsageCalculatedByPilotMode) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="progress-group-bars">
              <CProgress thin color="warning-gradient" value={item.value} />
            </div>
          </div>
        ))}

        <div className="mb-5"></div>

        {respondAIModelsUsages.map((item, index) => (
          <div className="progress-group" key={index}>
            <div className="progress-group-header">
              <AIModelIcon modelName={item.name} />
              <span>{item.name}</span>
              <span className="ms-auto fw-semibold">
                {item.value}
                <span className="text-medium-emphasis small">
                  ({((item.value / totalTokenUsageCalculatedByAIModel) * 100 || 0).toFixed(1)} %)
                </span>
              </span>
            </div>
            <div className="progress-group-bars">
              <CProgress
                thin
                color="success-gradient"
                value={parseInt(((item.value / totalTokenUsageCalculatedByAIModel) * 100).toFixed(1))}
              />
            </div>
          </div>
        ))}
      </CCardBody>
    </CCard>
  );
};
