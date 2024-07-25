import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CButton, CCard, CCardBody, CCol, CFormLabel, CRow, CSmartTable } from '@coreui/react-pro';
import DeletionStatusBadge from 'components/badge/DeletionStatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import RoleDetailForm from 'components/role/RoleDetailForm';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import RoleService from 'services/role/RoleService';
import { jwtTokenState, userRoleSelector } from 'states/jwtTokenState';
import { formatToYMD } from 'utils/common/dateUtils';
import { roleColumnConfig } from 'views/pages/role/roleColumnConfig';

const RoleManagementPage = () => {
  const [roleList, setRoleList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [formMode, setFormMode] = useState('');

  const isSearchPerformed = useRef(false);

  const userRole = useRecoilValue(userRoleSelector);

  const { addToast } = useToast();
  const modal = useModal();
  const navigate = useNavigate();
  const resetJwtToken = useResetRecoilState(jwtTokenState);

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const fetchRoleList = useCallback(async () => {
    if (!isSearchPerformed.current) {
      isSearchPerformed.current = true;
    }
    try {
      setIsLoading(true);
      const data = await RoleService.getRoles();
      setRoleList(data);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    void fetchRoleList();
  }, [fetchRoleList]);

  const handleSignOut = () => {
    navigate('/sign-in');
    resetJwtToken();
    localStorage.removeItem('token');
  };

  const handleRowClick = (id) => {
    setFormMode('read');
    modal.openModal(id);
  };

  const handleCreateClick = () => {
    setFormMode('create');
    modal.openModal();
  };

  const handleDeleteRestoreClick = async (shouldDelete) => {
    const ids = checkedItems.map((item) => item.id);
    try {
      const response = await RoleService.deleteRoles(ids, shouldDelete);
      const roleNames = roleList
        .filter((roleItem) => response.includes(roleItem.id))
        .map((filteredRoleItem) => filteredRoleItem.role);
      const isIncludeUserRole = roleNames.some((roleName) => userRole?.includes(roleName));
      if (shouldDelete && isIncludeUserRole) {
        handleSignOut();
      } else {
        void fetchRoleList();
      }
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    setCheckedItems([]);
  };

  return (
    <>
      <CRow>
        <CCard className="row g-3">
          <CCardBody>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-start">
                <CButton onClick={handleCreateClick}>권한 추가</CButton>
                <CButton
                  disabled={checkedItems?.length === 0 || isDeletedRow(checkedItems)}
                  onClick={() => handleDeleteRestoreClick(true)}
                >
                  삭제
                </CButton>
                <CButton
                  disabled={checkedItems?.length === 0 || !isDeletedRow(checkedItems)}
                  onClick={() => handleDeleteRestoreClick(false)}
                >
                  복구
                </CButton>
                <ExcelDownloadCButton
                  downloadFunction={RoleService.getDownloadRoleList}
                  searchFormData={roleList?.length !== 0}
                />
              </CCol>
              <CCol className="d-flex justify-content-end">
                <CFormLabel>총 {roleList?.length} 개의 검색 결과</CFormLabel>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              {/*REMIND Pagination 적용 필요*/}
              <CSmartTable
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={roleList?.length}
                    isSearchPerformed={isSearchPerformed.current}
                  />
                }
                loading={isLoading}
                sorterValue={{ column: 'id', state: 'asc' }}
                items={roleList}
                columns={roleColumnConfig}
                selectable
                scopedColumns={{
                  role: (item) => (
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        handleRowClick(item.id);
                      }}
                    >
                      {item.role}
                    </td>
                  ),
                  createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
                  modifiedAt: (item) => <td>{formatToYMD(item.modifiedAt)}</td>,
                  deleted: (item) => (
                    <td>
                      <DeletionStatusBadge deleted={item.deleted} />
                    </td>
                  ),
                }}
                onSelectedItemsChange={(items) => {
                  setCheckedItems(items);
                }}
                tableProps={{
                  responsive: true,
                  hover: true,
                }}
                selected={checkedItems}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
      <ModalContainer visible={modal.isOpen} title="권한 정보" size="lg" onClose={modal.closeModal}>
        <RoleDetailForm initialFormMode={formMode} closeModal={modal.closeModal} fetchRoleList={fetchRoleList} />
      </ModalContainer>
    </>
  );
};

export default RoleManagementPage;
