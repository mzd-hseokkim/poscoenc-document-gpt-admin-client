import React, { useEffect, useRef, useState } from 'react';

import { CButton, CCard, CCardBody, CCol, CForm, CFormInput, CFormSelect, CRow, CSmartTable } from '@coreui/react-pro';
import DeletionStatusBadge from 'components/badge/DeletionStatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import UserDetailForm from 'components/user/UserDetailForm';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import UserService from 'services/UserService';
import { userColumnConfig } from 'views/pages/user/userColumnConfig';

const UserManagementPage = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [formMode, setFormMode] = useState('');
  const [totalUserElements, setTotalUserElements] = useState(0);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const initialFormData = {
    name: '',
    email: '',
    team: '',
    memo: '',
    deletionOption: 'ALL',
  };
  const [formData, setFormData] = useState(initialFormData);
  const isComponentMounted = useRef(true);

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalUserElements);
  const { addToast } = useToast();
  const modal = useModal();

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void fetchUserList();
    }
  }, [pageableData]);

  const fetchUserList = async () => {
    if (!isSearchPerformed) {
      setIsSearchPerformed(true);
    }
    try {
      setIsLoading(true);
      const data = await UserService.getUsers(formData, pageableData);
      setUserList(data.content);
      setTotalUserElements(data.totalElements);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    void fetchUserList();
  };

  const handleReset = () => {
    setFormData(initialFormData);
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
      await UserService.deleteUsers(ids, shouldDelete);
      void fetchUserList();
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
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput id="name" label="이름" value={formData.name} onChange={handleChange} />
                </CCol>
                <CCol md={6}>
                  <CFormInput id="email" label="이메일" value={formData.email} onChange={handleChange} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput id="team" label="팀" value={formData.team} onChange={handleChange} />
                </CCol>
                <CCol md={6}>
                  <CFormInput id="memo" label="메모" value={formData.memo} onChange={handleChange} />
                </CCol>
                <CRow className="mb-3"></CRow>
                <CCol md={6}>
                  <CFormSelect
                    id="deletionOption"
                    label="사용자 상태"
                    name="deletionOption"
                    options={[
                      { label: '모든 사용자', value: '' },
                      { label: '삭제됨', value: 'Yes' },
                      { label: '삭제되지 않음', value: 'NO' },
                    ]}
                    value={formData.deletionOption}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton onClick={handleReset}>초기화</CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CRow>
      <CRow>
        <CCard className="row g-3">
          <CCardBody>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-start">
                <CButton onClick={handleCreateClick}>사용자 추가</CButton>
                <CButton onClick={() => handleDeleteRestoreClick(true)}>삭제</CButton>
                <CButton onClick={() => handleDeleteRestoreClick(false)}>복구</CButton>
                <ExcelDownloadCButton
                  downloadFunction={UserService.getDownloadSearchedUserList}
                  searchFormData={formData}
                  hasSearchResults={userList.length !== 0}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={{
                  external: true,
                  resetable: false,
                }}
                columns={userColumnConfig}
                items={userList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 사용자 개수"
                itemsPerPageSelect
                loading={isLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel contentLength={userList.length} isSearchPerformed={isSearchPerformed} />
                }
                onItemsPerPageChange={handlePageSizeChange}
                onSelectedItemsChange={(items) => {
                  setCheckedItems(items);
                }}
                onSorterChange={(sorterValue) => handlePageSortChange(sorterValue)}
                paginationProps={smartPaginationProps}
                scopedColumns={{
                  name: (item) => (
                    <td
                      onClick={() => {
                        handleRowClick(item.id);
                      }}
                    >
                      {item.name}
                    </td>
                  ),
                  deleted: (item) => (
                    <td>
                      <DeletionStatusBadge deleted={item.deleted} />
                    </td>
                  ),
                }}
                selectable
                selected={checkedItems}
                tableProps={{
                  hover: true,
                  responsive: true,
                }}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
      <ModalContainer visible={modal.isOpen} title="사용자 정보" size="lg" onClose={modal.closeModal}>
        <UserDetailForm initialFormMode={formMode} closeModal={modal.closeModal} fetchUserList={fetchUserList} />
      </ModalContainer>
    </>
  );
};

export default UserManagementPage;
