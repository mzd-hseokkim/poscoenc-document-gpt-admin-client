import React, { useEffect, useRef, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDateRangePicker,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import AdminDetailForm from 'components/admin/AdminDetailForm';
import StatusBadge from 'components/badge/StatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
import { format } from 'date-fns';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import AdminService from 'services/admin/AdminService';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  formatToYMD,
  getCurrentDate,
  getOneYearAgoDate,
} from 'utils/common/dateUtils';
import { adminColumnConfig } from 'views/pages/admin/adminColumnConfig';

const createInitialFormData = () => ({
  email: '',
  name: '',
  role: '',
  fromCreatedAt: getOneYearAgoDate(),
  toCreatedAt: getCurrentDate(),
  fromModifiedAt: getOneYearAgoDate(),
  toModifiedAt: getCurrentDate(),
  fromLoggedInAt: getOneYearAgoDate(),
  toLoggedInAt: getCurrentDate(),
  deletionOption: 'ALL',
  findEmptyLogin: true,
});

const AdminManagementPage = () => {
  const [adminList, setAdminList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [formMode, setFormMode] = useState('');
  const [totalAdminElements, setTotalAdminElements] = useState(0);
  const [formData, setFormData] = useState(createInitialFormData);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [isPickTime, setIsPickTime] = useState(false);

  const isComponentMounted = useRef(true);

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalAdminElements);
  const { addToast } = useToast();
  const modal = useModal();

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void fetchAdminList();
    }
  }, [pageableData]);

  const fetchAdminList = async () => {
    if (!isSearchPerformed) {
      setIsSearchPerformed(true);
    }
    try {
      setIsLoading(true);
      const data = await AdminService.getAdmins(formData, pageableData);
      setAdminList(data.content);
      setTotalAdminElements(data.totalElements);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ color: 'danger', message: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
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

  const handleTimePickerCheck = (e) => {
    setIsPickTime(e.target.checked);
    setFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(formData.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(formData.toCreatedAt, "yyyy-MM-dd'T'23:59"),
      fromModifiedAt: format(formData.fromModifiedAt, "yyyy-MM-dd'T'00:00"),
      toModifiedAt: format(formData.toModifiedAt, "yyyy-MM-dd'T'23:59"),
    }));
  };

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRowClick = (id) => {
    setFormMode('read');
    modal.openModal(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    void fetchAdminList();
  };

  const handleReset = () => {
    setFormData(createInitialFormData);
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
        addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
      }
    } else {
      try {
        await AdminService.deleteAdmins(ids, shouldDelete);
        fetchAdminList();
      } catch (error) {
        addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
      }
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
                    key={`createdAt-${isPickTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={formData.fromCreatedAt}
                    endDate={formData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={4}>
                  <CDateRangePicker
                    key={`modifiedAt-${isPickTime}`}
                    id="modifiedAt"
                    label="수정일"
                    startDate={formData.fromModifiedAt}
                    endDate={formData.toModifiedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'modifiedAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'modifiedAt', newDate, isStartDate: false })}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={4}>
                  <CDateRangePicker
                    key={`lastLoggedInAt-${isPickTime}`}
                    id="lastLoggedInAt"
                    label="최근 로그인"
                    startDate={formData.fromLoggedInAt}
                    endDate={formData.toLoggedInAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'lastLoggedInAt', newDate })}
                    onEndDateChange={(newDate) =>
                      handleDateChange({ id: 'lastLoggedInAt', newDate, isStartDate: false })
                    }
                    timepicker={isPickTime}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormCheck label="시간 검색 여부" checked={isPickTime} onChange={(e) => handleTimePickerCheck(e)} />
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
        <CCard className="row g-3 mb-3">
          <CCardBody>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-start">
                <CButton onClick={handleCreateClick}>관리자 추가</CButton>
                <CButton onClick={() => handleDeleteRestoreClick(true)}>삭제</CButton>
                <CButton onClick={() => handleDeleteRestoreClick(false)}>복구</CButton>
                <ExcelDownloadCButton
                  downloadFunction={AdminService.getDownloadAdminList}
                  searchFormData={formData}
                  hasSearchResults={adminList.length !== 0}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={{
                  external: true,
                  resetable: false,
                }}
                onSorterChange={(sorterValue) => handlePageSortChange(sorterValue)}
                paginationProps={smartPaginationProps}
                itemsPerPageSelect
                itemsPerPage={pageableData.size}
                onItemsPerPageChange={handlePageSizeChange}
                itemsPerPageLabel="페이지당 관리자 개수"
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={adminList.length}
                    isSearchPerformed={isSearchPerformed}
                    defaultMessage="검색 조건에 맞는 관리자를 검색합니다."
                  />
                }
                loading={isLoading}
                items={adminList}
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
      </CRow>
      <ModalContainer visible={modal.isOpen} title="관리자 정보" size="lg" onClose={modal.closeModal}>
        <AdminDetailForm initialFormMode={formMode} closeModal={modal.closeModal} fetchAdminList={fetchAdminList} />
      </ModalContainer>
    </>
  );
};

export default AdminManagementPage;
