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

import AdminDetailForm from '../../../components/admin/AdminDetailForm';
import StatusBadge from '../../../components/board/BoadStatusBadge';
import ModalContainer from '../../../components/modal/ModalContainer';
import useModal from '../../../hooks/useModal';
import useToast from '../../../hooks/useToast';
import AdminService from '../../../services/admin/AdminService';
import { adminColumnConfig } from '../../../utils/admin/adminColumnConfig';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  formatToYMD,
  getCurrentDate,
  getOneYearAgoDate,
} from '../../../utils/common/dateUtils';

const AdminManagementPage = () => {
  const [AdminList, setAdminList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [formMode, setFormMode] = useState('');

  const createInitialFormData = () => ({
    name: '',
    urlPath: '',
    menuOrder: '',
    parentId: '',
    fromCreatedAt: getOneYearAgoDate(),
    toCreatedAt: getCurrentDate(),
    fromModifiedAt: getOneYearAgoDate(),
    toModifiedAt: getCurrentDate(),
    deletionOption: 'ALL',
  });

  const [formData, setFormData] = useState(createInitialFormData);

  const addToast = useToast();
  const modal = useModal();

  const fetchAdminList = async () => {
    try {
      setIsLoading(true);
      const data = await AdminService.getAdmins(formData);
      setAdminList(data.content);
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
    fetchAdminList();
  };

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = ({ id, newDate, isStartDate = true }) => {
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
      modifiedAt: isStartDate ? 'fromModifiedAt' : 'toModifiedAt',
      lastLoggedInAt: isStartDate ? 'fromLoggedInAt' : 'toLoggedInAt',
    };

    const fieldToUpdate = fieldMap[id];
    if (fieldToUpdate) {
      const formattedDate = isStartDate ? formatToIsoStartDate(newDate) : formatToIsoEndDate(newDate);
      setFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
    }
  };

  const handleReset = () => {
    setFormData(createInitialFormData);
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
        await AdminService.deleteAdmin(ids, shouldDelete);
        fetchAdminList();
      } catch (error) {
        addToast({ color: 'danger', message: error.message });
      }
    } else {
      try {
        await AdminService.deleteAdmins(ids, shouldDelete);
        fetchAdminList();
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
          <CCardTitle>관리자 관리</CCardTitle>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput id="email" label="이메일" value={formData.email} onChange={handleChange} />
              </CCol>
              <CCol md={4}>
                <CFormInput id="name" label="이름" value={formData.name} onChange={handleChange} />
              </CCol>
              <CCol md={4}>
                <CFormInput id="role" label="권한" value={formData.role} onChange={handleChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CDateRangePicker
                  id="createdAt"
                  label="생성일"
                  startDate={formData.fromCreatedAt}
                  endDate={formData.toCreatedAt}
                  onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                  onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                />
              </CCol>
              <CCol md={4}>
                <CDateRangePicker
                  id="modifiedAt"
                  label="수정일"
                  startDate={formData.fromModifiedAt}
                  endDate={formData.toModifiedAt}
                  onStartDateChange={(newDate) => handleDateChange({ id: 'modifiedAt', newDate })}
                  onEndDateChange={(newDate) => handleDateChange({ id: 'modifiedAt', newDate, isStartDate: false })}
                />
              </CCol>
              <CCol md={4}>
                <CDateRangePicker
                  id="lastLoggedInAt"
                  label="최근 로그인"
                  startDate={formData.fromLoggedInAt}
                  endDate={formData.toLoggedInAt}
                  onStartDateChange={(newDate) => handleDateChange({ id: 'lastLoggedInAt', newDate })}
                  onEndDateChange={(newDate) => handleDateChange({ id: 'lastLoggedInAt', newDate, isStartDate: false })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormSelect
                  id="deletionOption"
                  label="관리자 상태"
                  name="deletionOption"
                  options={[
                    { label: '모든 관리자', value: '' },
                    { label: '삭제됨', value: 'Yes' },
                    { label: '삭제되지 않음', value: 'NO' },
                  ]}
                  value={formData.deletionOption}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  id="findEmptyLogin"
                  label="미로그인 관리자 검색"
                  name="deletionOption"
                  options={[
                    { label: '아니오', value: false },
                    { label: '예', value: true },
                  ]}
                  value={formData.findEmptyLogin}
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
              <CButton onClick={handleCreateClick}>관리자 추가</CButton>
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
              itemsPerPageLabel="페이지당 관리자 개수"
              noItemsLabel="검색 결과가 없습니다."
              loading={isLoading}
              sorterValue={{ column: 'id', state: 'asc' }}
              items={AdminList}
              columns={adminColumnConfig}
              selectable
              scopedColumns={{
                email: (item) => (
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      handleRowClick(item.id);
                    }}
                  >
                    {item.email}
                  </td>
                ),
                lastLoggedInAt: (item) => <td>{formatToYMD(item.lastLoggedInAt)}</td>,
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
      <ModalContainer visible={modal.isOpen} title="관리자 정보" onClose={modal.closeModal}>
        <AdminDetailForm
          selectedId={selectedId}
          initialFormMode={formMode}
          closeModal={modal.closeModal}
          fetchAdminList={fetchAdminList}
        />
      </ModalContainer>
    </>
  );
};

export default AdminManagementPage;
