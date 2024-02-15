import React, { useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CDateRangePicker,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import { format } from 'date-fns';

import StatusBadge from '../../../components/board/BoadStatusBadge';
import ModalContainer from '../../../components/modal/ModalContainer';
import UserDetailForm from '../../../components/user/UserDetailForm';
import useModal from '../../../hooks/useModal';
import useToast from '../../../hooks/useToast';
import UserService from '../../../services/UserService';
import { userColumnConfig } from '../../../utils/user/userColumnConfig';

const UserManagementPage = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [formMode, setFormMode] = useState('');

  const initialFormData = {
    name: '',
    email: '',
    team: '',
    memo: '',
    fromCreatedAt: format(startDate, "yyyy-MM-dd'T'00:00"),
    toCreatedAt: format(endDate, "yyyy-MM-dd'T'23:59"),
    deletionOption: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const addToast = useToast();
  const modal = useModal();

  const getUserList = async () => {
    try {
      setIsLoading(true);
      const data = await UserService.getUserList(formData);
      setUserList(data.content);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ color: 'danger', body: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getUserList();
  };

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(new Date(newDate), "yyyy-MM-dd'T'00:00"),
    }));
  };

  const handleEndDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      toCreatedAt: format(new Date(newDate), "yyyy-MM-dd'T'23:59"),
    }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    setEndDate(new Date());
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
        await UserService.patchDeleteSingleUser(ids, shouldDelete);
        getUserList();
      } catch (error) {
        addToast({ color: 'danger', message: error.message });
      }
    } else {
      try {
        await UserService.patchDeleteMultipleUser(ids, shouldDelete);
        getUserList();
      } catch (error) {
        addToast({ color: 'danger', message: error.message });
      }
    }
    setCheckedItems([]);
  };

  return (
    <>
      <CCard className="row g-3">
        <CCardBody>
          <CCardTitle>사용자 관리</CCardTitle>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput id="name" label="이름" value={formData.name} onChange={handleChange} />
              </CCol>
              <CCol md={4}>
                <CFormInput id="email" label="이메일" value={formData.email} onChange={handleChange} />
              </CCol>
              <CCol md={4}>
                <CFormInput id="team" label="팀" value={formData.team} onChange={handleChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput id="memo" label="메모" value={formData.memo} onChange={handleChange} />
              </CCol>
              <CCol md={5}>
                <CDateRangePicker
                  id="createdAt"
                  label="생성일"
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={(newDate) => handleStartDateChange(newDate)}
                  onEndDateChange={(newDate) => handleEndDateChange(newDate)}
                />
              </CCol>
              <CCol md={3}>
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
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton type="submit">검색</CButton>
                <CButton onClick={handleReset}>초기화</CButton>
              </CCol>
            </CRow>
          </CForm>
          <CRow className="mb-3">
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton onClick={handleCreateClick}>사용자 추가</CButton>
              <CButton onClick={() => handleDeleteRestoreClick(true)}>삭제</CButton>
              <CButton onClick={() => handleDeleteRestoreClick(false)}>복구</CButton>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CSmartTable
              pagination
              activePage={1}
              itemsPerPageSelect
              itemsPerPage={10}
              itemsPerPageLabel="페이지당 사용자 개수"
              noItemsLabel="검색 결과가 없습니다."
              loading={isLoading}
              sorterValue={{ column: 'id', state: 'asc' }}
              items={userList}
              columns={userColumnConfig}
              selectable
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
      <ModalContainer visible={modal.isOpen} title="사용자 정보" onClose={modal.closeModal}>
        <UserDetailForm
          selectedId={selectedId}
          initialFormMode={formMode}
          closeModal={modal.closeModal}
          fetchUserList={getUserList}
        />
      </ModalContainer>
    </>
  );
};

export default UserManagementPage;
