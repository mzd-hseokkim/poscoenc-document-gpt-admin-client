import React, { useEffect, useState } from 'react';

import { cilBook, cilExternalLink, cilScreenDesktop, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCloseButton,
  CCol,
  CCollapse,
  CPopover,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { AIModelIcon } from 'components/icon/AIModelIcon';
import { useNavigation } from 'context/NavigationContext';
import { PiThumbsUpFill } from 'react-icons/pi';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { formatToYMD } from 'utils/common/dateUtils';

//REMIND 응답받은 entry 의 id 로 검색해서 가져오거나, 한번에 받아오거나 결정 필요.
const AnswerExample = [
  {
    message: '안녕하세요 무엇을 도와드릴까요?',
  },
  {
    message:
      '### 핵심 답변 한 줄 요약\n해당 계약서는 한국파파존스㈜와 메가존 주식회사 간에 통합 메시지 서비스 제공에 관한 계약서로, 서비스 제공, 사용료 정산, 계약 기간, 서비스 제공 중단 및 변경, 비용 및 대금 결제, 담보조건, 계약 해지, 손해배상, 비밀유지, 면책, 계약의 해석, 관할법원 등에 대한 내용이 포함되어 있습니다.\n\n---\n\n### 상세 답변\n\n해당 계약서는 한국파파존스㈜와 메가존 주식회사 간에 통합 메시지 서비스 제공에 관한 계약서입니다. 이를 상세히 설명하면, \n1. 계약의 목적은 [동]에 대해 [행]이 통합 메시지 서비스를 제공하고, [행]에 대해 [동]이 서비스에 대한 사용료를 정산함에 따른 쌍방의 권리와 의무를 명시하고, 이를 성실히 이행함으로써 상호 이익을 증진하는데 그 목적이 있다.\n2. 계약의 기간은 쌍방의 서비스 개시일로부터 1 년간으로 한다. 서비스의 종료는 [동]이 서비스 종료 20 영업일 전에 [행]에 서면 통보함으로써 종료된다.\n3. [행]이 제공하는 “통합 메시지 서비스”는 [동]이 지정한 “고객”에게 [동]이 제공하는 정보(“통합 메시지”의 내용)를 [행]의 시스템을 통해 “고객”에게 전달하는 것에 한한다.\n4. [행]은 본 계약과 관련하여 발생되는 [동]의 채무를 담보하기 위하여 담보제공을 요청할 수 있으며, [동]은 보증보험증권 또는 현금예치 등의 담보를 제공해야 한다.\n5. 계약 당사자는 다음 각 호에 해당하는 경우에는 본 계약 불이행에 대하여 계약 당사자간 책임을 지지 않는다. 천재지변, 폭동, 전쟁, 소요사태 또는 이에 준하는 사유로 불가항력적으로 발생된 경우, 정부(지방자치단체, 감독기관 포함)의 규제로 인하여 불가항력적으로 발생된 경우, 계약당사자간에 서면으로 합의한 경우, 각 당사자의 귀책이 아님을 증명한 경우 등이 해당됩니다.\n\n---\n\n### 추가 정보\n\n해당 계약서에 대한 연관 정보가 다음과 같이 검색되었습니다.\n1. 계약서에는 통합 메시지 서비스를 제공하는 [행]과 이를 이용하는 [동]의 권리와 의무가 상세히 기술되어 있습니다.\n2. 계약 기간은 1년이며, 계약 해지를 원할 경우 20 영업일 전에 서면으로 통보해야 합니다.\n3. [행]은 [동]의 채무를 담보하기 위해 담보제공을 요청할 수 있으며, 이에 [동]은 보증보험증권 또는 현금예치 등의 담보를 제공해야 합니다.\n\n---\n\n### 출처\n\n- 계약의 목적 : 1조 (2 page)\n- 계약의 기간 : 3조 (2 page)\n- 서비스의 범위 : 5조 (3 page)\n- 담보조건 : 8조 (3 page)\n- 면책 : 16조 (5 page)\n\n---\n\n### 추가 질문\n- 계약 기간이 종료된 후에는 어떻게 되나요?\n- 담보제공을 요청받았을 때, [동]이 응하지 않으면 어떻게 되나요?\n- 계약 당사자가 불이행했을 때의 책임은 어떻게 되나요?\n\n---\n\n',
  },
];

export const RecentlyLikedChatHistoryList = ({ isLoading, recentlyLikedChatList }) => {
  const [hoveredLikedChatIndexes, setHoveredLikedChatIndexes] = useState({});
  const { navigate } = useNavigation();

  useEffect(() => {
    const initialIndexes = {};
    recentlyLikedChatList?.forEach((_, index) => {
      initialIndexes[index] = false;
    });
    setHoveredLikedChatIndexes(initialIndexes);
  }, [recentlyLikedChatList]);

  const togglePopoverVisibility = (index) => {
    setHoveredLikedChatIndexes((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const customPopoverStyle = {
    '--cui-popover-max-width': '500px',
    '--cui-popover-max-height': '1000px',
    '--cui-popover-border-color': 'var(--cui-primary)',
    '--cui-popover-header-bg': 'var(--cui-primary)',
    '--cui-popover-header-color': 'var(--cui-white)',
  };

  return (
    <CCard className="m-3" style={{ minHeight: '20rem' }}>
      <CCardHeader className="d-flex align-items-center justify-content-between bold">
        최근 좋아요 표시된 답변
        <small className="text-medium-emphasis"> 질문 클릭 시 해당 답변을 볼 수 있습니다.</small>
      </CCardHeader>
      <CCardBody>
        <FormLoadingCover isLoading={isLoading} />
        <CSmartTable
          items={recentlyLikedChatList}
          // pagination={true}
          columns={[
            {
              key: 'documentCollectionDisplayName',
              label: '해당 문서',
              _style: { width: '15%' },
              _props: { className: 'text-center' },
              filter: false,
              sorter: false,
            },
            { key: 'name', label: '질문', _props: { className: 'text-nowrap' }, _style: { width: '25%' } },
            { key: 'modelName', label: 'Model', _style: { width: '20%' }, _props: { className: 'text-center' } },

            { key: 'pilotMode', label: 'Pilot', _style: { width: '10%' } },
            { key: 'createdAt', label: 'CreatedAt', _style: { width: '10%' } },
            {
              key: 'externalLink',
              label: '',
              _style: { width: '5%' },
              filter: false,
              sorter: false,
            },
          ]}
          tableProps={{
            align: 'middle',
            className: 'mb-0 border',
            hover: true,
          }}
          tableHeadProps={{
            color: 'secondary',
          }}
          scopedColumns={{
            documentCollectionDisplayName: (item) => (
              <td className="text-center">
                <CPopover
                  content={<div className="bold">{item.metadata.documentCollectionDisplayName}</div>}
                  placement="bottom"
                  trigger="hover"
                  delay={300}
                  style={{
                    '--cui-popover-border-color': 'var(--cui-primary)',
                  }}
                >
                  <CIcon
                    icon={cilBook}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate(`/document-collections/management?id=${item.metadata.documentCollectionId}`)
                    }
                  />
                </CPopover>
              </td>
            ),
            name: (item, index) => (
              <CPopover
                title={
                  <>
                    <CRow className="">
                      <CCol sm={4} className="d-flex align-items-end">
                        <h6 id="answer">답변</h6>
                      </CCol>
                      <CCol sm={8} className="d-flex align-content-center justify-content-end">
                        <CBadge color={'info'} id="modelName" className="m-2 text-center align-content-center">
                          {item.metadata.modelName}
                        </CBadge>
                        <CBadge color={'primary'} id="pilotMode" className="m-2">
                          {item.metadata.pilotMode === 'C' ? 'Co-pilot' : 'Auto-pilot'}
                        </CBadge>
                        <CBadge id="thumb" style={{ backgroundColor: '#3f66fc', margin: '.5rem 1rem .5rem .25rem' }}>
                          <PiThumbsUpFill />
                        </CBadge>
                        <CCloseButton
                          className="align-self-center"
                          style={{
                            filter: 'var(--cui-btn-close-white-filter)',
                          }}
                          onClick={() => togglePopoverVisibility(index)}
                        />
                      </CCol>
                    </CRow>
                  </>
                }
                content={
                  // REMIND ID 로 다시 불러오는걸로 일단 구현
                  <>
                    <CCard>
                      <CCollapse visible={index !== null}>
                        <CCardBody style={{ maxHeight: '600px', overflowX: 'scroll' }}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            className="reactMarkdown"
                          >
                            {AnswerExample?.[index]?.message}
                          </ReactMarkdown>
                        </CCardBody>
                      </CCollapse>
                    </CCard>
                  </>
                }
                placement="bottom"
                trigger={[]}
                visible={hoveredLikedChatIndexes[index]}
                style={customPopoverStyle}
              >
                <td onClick={() => togglePopoverVisibility(index)} style={{ cursor: 'pointer' }}>
                  <CPopover content={item.name} placement="top" trigger="hover" delay={300}>
                    <div
                      className="overflow-hidden text-truncate"
                      style={{
                        maxWidth: '12rem',
                        overflowY: 'hidden',
                      }}
                    >
                      {item.name}
                    </div>
                  </CPopover>
                </td>
              </CPopover>
            ),
            modelName: (item) => (
              <td
                className="overflow-hidden text-truncate"
                style={{
                  maxWidth: '6rem',
                  overflowY: 'hidden',
                }}
              >
                <div className="d-flex justify-content-center align-content-center">
                  <AIModelIcon modelName={item.metadata.modelName} />
                </div>
              </td>
            ),
            pilotMode: (item) => (
              <td className="text-center">
                <CIcon icon={item.metadata.pilotMode === 'A' ? cilScreenDesktop : cilUser} />
              </td>
            ),
            createdAt: (item) => (
              <td className="text-center">
                <div className="text-medium-emphasis text-nowrap">{formatToYMD(item.recordedAt)}</div>
              </td>
            ),

            externalLink: (item) => (
              <td className="text-center">
                <CIcon
                  style={{ cursor: 'pointer' }}
                  icon={cilExternalLink}
                  //REMIND 권한에 따른 버튼 블록 기능 구현 필요
                  onClick={() => navigate(`/document-collections-chat-history/management?id=${item.id}`)}
                />
              </td>
            ),
          }}
        />
      </CCardBody>
    </CCard>
  );
};
