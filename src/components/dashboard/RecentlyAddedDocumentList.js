import React, { useState } from 'react';

import {
  cilArrowThickFromLeft,
  cilArrowThickFromRight,
  cilChevronLeft,
  cilChevronRight,
  cilExternalLink,
  cilSitemap,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
  CPopover,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { useNavigation } from 'context/NavigationContext';
import { isToday } from 'date-fns';
import { formatToYMD } from 'utils/common/dateUtils';

export const RecentlyAddedDocumentList = ({
  isStandardContractLoading,
  isDocumentCollectionLoading,
  standardContractList,
  documentCollectionList,
}) => {
  const [standardContractDocumentTableVisible, setStandardContractDocumentTableVisible] = useState(false);
  const [newContractDocumentTableVisible, setNewContractDocumentTableVisible] = useState(false);

  const { navigate } = useNavigation();

  const handleOpenStandardContractTable = () => {
    if (newContractDocumentTableVisible) {
      return;
    }
    setStandardContractDocumentTableVisible(!standardContractDocumentTableVisible);
  };

  const handleOpenNewContractDocumentTable = () => {
    if (standardContractDocumentTableVisible) {
      return;
    }
    setNewContractDocumentTableVisible(!newContractDocumentTableVisible);
  };

  return (
    <CCard className="m-3" style={{ minHeight: '20rem' }}>
      <CCardHeader className="bold"> 최근 등록된 표준 계약서 & 계약 문서 </CCardHeader>
      <CCardBody className="table-wrapper">
        <div
          className={`table-container ${standardContractDocumentTableVisible ? 'table-expanded-right' : ''}`}
          style={{
            zIndex: standardContractDocumentTableVisible ? 2 : 1,
            opacity: newContractDocumentTableVisible ? 0.15 : 1,
            marginRight: standardContractDocumentTableVisible ? '-300px' : '-40px',
          }}
        >
          <FormLoadingCover isLoading={isStandardContractLoading} />
          <CTable align="middle" className="mb-0 border ms-2" hover style={{ maxWidth: '270px' }}>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell
                  style={{ cursor: newContractDocumentTableVisible ? '' : 'pointer', whiteSpace: 'nowrap' }}
                  onClick={handleOpenStandardContractTable}
                >
                  Standard Con
                  <CIcon
                    style={{ marginLeft: '1rem' }}
                    icon={standardContractDocumentTableVisible ? cilChevronLeft : cilChevronRight}
                  />
                </CTableHeaderCell>

                <CTableHeaderCell>
                  <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                    <div className="d-flex justify-content-center" style={{ minWidth: '20px' }}>
                      <CPopover
                        placement="top"
                        trigger={['hover', 'focus']}
                        content={'해당 표준 계약서에 의해 작성된 계약서 개수입니다.'}
                      >
                        <CIcon icon={cilSitemap} size={'lg'} />
                      </CPopover>
                    </div>
                  </CCollapse>
                </CTableHeaderCell>
                <CTableHeaderCell>
                  <p className="collapsable-table-header">CreatedAt</p>
                </CTableHeaderCell>

                <CTableHeaderCell>
                  <CCollapse visible={standardContractDocumentTableVisible} horizontal></CCollapse>
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {standardContractList?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    {item.name.length > 12 ? (
                      <CPopover content={item.name} placement="bottom" trigger="hover" delay={300}>
                        <div
                          className="overflow-hidden text-truncate"
                          style={{
                            maxWidth: '11rem',
                          }}
                        >
                          {item.name}
                        </div>
                      </CPopover>
                    ) : (
                      <div
                        className="overflow-hidden text-truncate"
                        style={{
                          maxWidth: '11rem',
                        }}
                      >
                        {item.name}
                      </div>
                    )}
                    {!standardContractDocumentTableVisible && isToday(new Date(item.createdAt)) && (
                      <CBadge
                        color="primary"
                        style={{
                          position: 'absolute',
                          top: 12 + 41 * (index + 1),
                          right: 1.5,
                        }}
                      >
                        Today
                      </CBadge>
                    )}
                  </CTableDataCell>

                  <CTableDataCell>
                    <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                      <div className="fw-semibold text-nowrap align-middle">{item.referCnt} 개</div>
                    </CCollapse>
                  </CTableDataCell>
                  <CTableDataCell>
                    {/*TODO CreateAt 은 batch 작업의 createdAt 이다. 문서의 createdAt 으로 변경해야함*/}
                    {isToday(new Date(item.createdAt)) ? (
                      <CBadge
                        color="primary"
                        style={{
                          position: 'absolute',
                          top: 12 + 41 * (index + 1),
                          right: 36,
                        }}
                      >
                        Today
                      </CBadge>
                    ) : (
                      <div className="small text-medium-emphasis text-nowrap">{formatToYMD(item.createdAt)}</div>
                    )}
                  </CTableDataCell>

                  <CTableDataCell>
                    <CCollapse visible={standardContractDocumentTableVisible} horizontal>
                      <CIcon
                        style={{ cursor: 'pointer' }}
                        icon={cilExternalLink}
                        onClick={() => navigate(`/standard-contracts/management?id=${item.id}`)}
                      />
                    </CCollapse>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
        <div
          className={`table-container ${newContractDocumentTableVisible ? 'table-expanded-left' : ''}`}
          style={{
            zIndex: newContractDocumentTableVisible ? 2 : 1,
            opacity: standardContractDocumentTableVisible ? 0.15 : 1,
            marginLeft: newContractDocumentTableVisible ? '-310px' : '-15px',
          }}
        >
          <FormLoadingCover isLoading={isDocumentCollectionLoading} />
          <CTable align="middle" className="mb-0 border me-2" hover responsive={'lg'} style={{ maxWidth: '270px' }}>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell
                  style={{ cursor: standardContractDocumentTableVisible ? '' : 'pointer', whiteSpace: 'nowrap' }}
                  onClick={handleOpenNewContractDocumentTable}
                >
                  Con
                  <CIcon
                    style={{ marginLeft: '5rem' }}
                    icon={newContractDocumentTableVisible ? cilArrowThickFromLeft : cilArrowThickFromRight}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell>
                  <CCollapse visible={newContractDocumentTableVisible} horizontal>
                    <p className="collapsable-table-header">New Chat</p>
                  </CCollapse>
                </CTableHeaderCell>
                <CTableHeaderCell>
                  {/*<CCollapse visible={newContractDocumentTableVisible} horizontal>*/}
                  <p className="collapsable-table-header">CreatedAt</p>
                  {/*</CCollapse>*/}
                </CTableHeaderCell>

                {/*{newContractDocumentTableVisible && (*/}
                <>
                  <CTableHeaderCell>
                    <CCollapse visible={newContractDocumentTableVisible} horizontal></CCollapse>
                  </CTableHeaderCell>
                </>
                {/*)}*/}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {documentCollectionList?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    {item.name.length > 12 ? (
                      <CPopover content={item.name} placement="bottom" trigger="hover" delay={300}>
                        <div
                          className="overflow-hidden text-truncate"
                          style={{
                            maxWidth: '11rem',
                          }}
                        >
                          {item.name}
                        </div>
                      </CPopover>
                    ) : (
                      <div
                        className="overflow-hidden text-truncate"
                        style={{
                          maxWidth: '11rem',
                        }}
                      >
                        {item.name}
                      </div>
                    )}
                    {!newContractDocumentTableVisible && isToday(new Date(item.createdAt)) && (
                      <CBadge
                        color="primary"
                        style={{
                          position: 'absolute',
                          top: 12 + 41 * (index + 1),
                          right: 1.5,
                        }}
                      >
                        Today
                      </CBadge>
                    )}
                  </CTableDataCell>

                  <CTableDataCell>
                    <CCollapse visible={newContractDocumentTableVisible} horizontal>
                      <div className="collapsable-table-data">
                        {/*<div className="small text-medium-emphasis">New</div>*/}
                        <div className="fw-semibold text-nowrap small text-medium-emphasis">
                          {formatToYMD(item.metadata.lastChatAt) || 'No chat'}
                        </div>
                      </div>
                    </CCollapse>
                  </CTableDataCell>
                  <CTableDataCell>
                    {/*<CCollapse visible={newContractDocumentTableVisible} horizontal>*/}
                    {isToday(new Date(item.createdAt)) ? (
                      <CBadge
                        color="primary"
                        style={{
                          position: 'absolute',
                          top: 12 + 41 * (index + 1),
                          right: 40,
                        }}
                      >
                        Today
                      </CBadge>
                    ) : (
                      <div className="small text-medium-emphasis text-nowrap">{formatToYMD(item.createdAt)}</div>
                    )}
                    {/*</CCollapse>*/}
                  </CTableDataCell>
                  {/*{newContractDocumentTableVisible && (*/}
                  <>
                    <CTableDataCell>
                      <CCollapse visible={newContractDocumentTableVisible} horizontal>
                        <CIcon
                          style={{ cursor: 'pointer' }}
                          icon={cilExternalLink}
                          //REMIND 아래 링크에서 없는 아이디로 요청 할 경우 서버에서 오류발생이라는 에러가 잘못뜨고있다. 찾을수없음으로 변경
                          onClick={() => navigate(`/document-collections/management?id=${item.id}`)}
                        />
                      </CCollapse>
                    </CTableDataCell>
                  </>
                  {/*)}*/}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </CCard>
  );
};
