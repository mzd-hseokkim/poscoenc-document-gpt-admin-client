import React, { useEffect, useState } from 'react';

import { CButton, CCard, CCardBody, CCardTitle, CCol, CRow, CSmartTable } from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import ModalContainer from 'components/modal/ModalContainer';
import RoleDetailForm from 'components/role/RoleDetailForm';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import RoleService from 'services/Role/RoleService';
import { formatToYMD } from 'utils/common/dateUtils';
import { roleColumnConfig } from 'utils/role/roleColumnConfig';

const AdminManagementPage = () => {
  const [RoleList, setRoleList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [formMode, setFormMode] = useState('');
  const [noItemsLabel, setNoItemsLabel] = useState('');

  const { addToast } = useToast();
  const modal = useModal();

  useEffect(() => {
    fetchRoleList();
  }, []);

  const fetchRoleList = async () => {
    try {
      setIsLoading(true);
      const data = await RoleService.getRoles();
      setRoleList(data);
      if (data.content.length === 0 && noItemsLabel === '') {
        setNoItemsLabel('검색 결과가 없습니다.');
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (id) => {
    setSelectedId(id);
    setFormMode('read');
    modal.openModal();
  };

  const handleCreateClick = () => {
    setFormMode('create');
    modal.openModal();
  };

  const handleDeleteRestoreClick = async (shouldDelete) => {
    const ids = checkedItems.map((item) => item.id);
    if (checkedItems.length === 1) {
      try {
        await RoleService.deleteRole(ids, shouldDelete);
        fetchRoleList();
      } catch (error) {
        addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
      }
    } else {
      try {
        await RoleService.deleteRoles(ids, shouldDelete);
        fetchRoleList();
      } catch (error) {
        addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
      }
    }
    setCheckedItems([]);
  };

  return (
    <>
      <CCard className="row g-3">
        <CCardBody>
          <CCardTitle>권한 관리</CCardTitle>
          <CRow className="mb-3">
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton onClick={handleCreateClick}>권한 추가</CButton>
              <CButton onClick={() => handleDeleteRestoreClick(true)}>삭제</CButton>
              <CButton onClick={() => handleDeleteRestoreClick(false)}>복구</CButton>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CSmartTable
              noItemsLabel={noItemsLabel}
              loading={isLoading}
              sorterValue={{ column: 'id', state: 'asc' }}
              items={RoleList}
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
                    <StatusBadge deleted={item.deleted} />
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
      <ModalContainer visible={modal.isOpen} title="권한 정보" size="lg" onClose={modal.closeModal}>
        <RoleDetailForm
          selectedId={selectedId}
          initialFormMode={formMode}
          closeModal={modal.closeModal}
          fetchRoleList={fetchRoleList}
        />
      </ModalContainer>
    </>
  );
};

export default AdminManagementPage;
