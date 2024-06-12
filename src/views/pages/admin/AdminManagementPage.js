import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDateRangePicker,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import AdminDetailForm from 'components/admin/AdminDetailForm';
import DeletionStatusBadge from 'components/badge/DeletionStatusBadge';
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
import { columnSorterCustomProps, tableCustomProps } from 'utils/common/smartTablePropsConfig';
import { adminColumnConfig } from 'views/pages/admin/adminColumnConfig';

const createInitialSearchFormData = () => ({
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
  const [searchFormData, setSearchFormData] = useState({});
  const [stagedSearchFormData, setStagedSearchFormData] = useState(createInitialSearchFormData);

  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [isPickTime, setIsPickTime] = useState(false);

  const isComponentMounted = useRef(true);

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalAdminElements);
  const { addToast } = useToast();
  const modal = useModal();

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const fetchAdminList = useCallback(async () => {
    if (!isSearchPerformed) {
      setIsSearchPerformed(true);
    }
    try {
      setIsLoading(true);
      const data = await AdminService.getAdmins(searchFormData, pageableData);
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
  }, [addToast, searchFormData, isSearchPerformed, pageableData]);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void fetchAdminList();
    }
  }, [fetchAdminList]);

  const handleDateChange = ({ id, newDate, isStartDate = true }) => {
    //REMIND 시간날 때 함수 리팩토링, 모듈화
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
      modifiedAt: isStartDate ? 'fromModifiedAt' : 'toModifiedAt',
      lastLoggedInAt: isStartDate ? 'fromLoggedInAt' : 'toLoggedInAt',
    };
    const fieldToUpdate = fieldMap[id];
    if (!fieldToUpdate) {
      return;
    }

    const newFormattedDate = newDate
      ? isPickTime
        ? formatToIsoEndDate(newDate)
        : format(new Date(newDate), "yyyy-MM-dd'T'23:59")
      : null;

    const formattedDate = isStartDate ? formatToIsoStartDate(newDate) : newFormattedDate;
    setStagedSearchFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
  };

  const handleTimePickerCheck = (e) => {
    setIsPickTime(e.target.checked);

    setStagedSearchFormData((prev) => ({
      ...prev,
      //검색 여부 체크 해제 시 기존의 설정된 시간 값들을 초기화
      fromCreatedAt: format(stagedSearchFormData.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(stagedSearchFormData.toCreatedAt, "yyyy-MM-dd'T'23:59"),
      fromModifiedAt: format(stagedSearchFormData.fromModifiedAt, "yyyy-MM-dd'T'00:00"),
      toModifiedAt: format(stagedSearchFormData.toModifiedAt, "yyyy-MM-dd'T'23:59"),
      fromLoggedInAt: format(stagedSearchFormData.fromLoggedInAt, "yyyy-MM-dd'T'00:00"),
      toLoggedInAt: format(stagedSearchFormData.toLoggedInAt, "yyyy-MM-dd'T'23:59"),
    }));
  };
  const handleSearchFormChange = ({ target: { id, value } }) => {
    setStagedSearchFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRowClick = (id) => {
    setFormMode('read');
    modal.openModal(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchFormData(stagedSearchFormData);
  };
  const handleSearchFormReset = () => {
    setStagedSearchFormData(createInitialSearchFormData);
    setIsPickTime(false);
  };
  const handleCreateClick = () => {
    setFormMode('create');

    modal.openModal();
  };

  const handleDeleteRestoreClick = async (shouldDelete) => {
    const ids = checkedItems.map((item) => item.id);
    try {
      await AdminService.deleteAdmins(ids, shouldDelete);
      void fetchAdminList();
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    setCheckedItems([]);
  };

  const scopedColumns = {
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
        <DeletionStatusBadge deleted={item.deleted} />
      </td>
    ),
  };

  return (
    <>
      <CRow>
        <CCard className="row g-3">
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormInput
                    id="email"
                    floatingLabel="이메일"
                    placeholder=""
                    value={stagedSearchFormData.email}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    id="name"
                    floatingLabel="이름"
                    placeholder=""
                    value={searchFormData.name}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    id="role"
                    floatingLabel="권한"
                    placeholder=""
                    value={searchFormData.role}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={4}>
                  <CDateRangePicker
                    key={`createdAt-${isPickTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={stagedSearchFormData.fromCreatedAt}
                    endDate={stagedSearchFormData.toCreatedAt}
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
                    startDate={stagedSearchFormData.fromModifiedAt}
                    endDate={stagedSearchFormData.toModifiedAt}
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
                    startDate={stagedSearchFormData.fromLoggedInAt}
                    endDate={stagedSearchFormData.toLoggedInAt}
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
                    value={stagedSearchFormData.deletionOption}
                    onChange={handleSearchFormChange}
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
                    value={stagedSearchFormData.findEmptyLogin}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton onClick={handleSearchFormReset}>초기화</CButton>
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
                  downloadFunction={AdminService.getDownloadAdminList}
                  searchFormData={searchFormData}
                  hasSearchResults={adminList.length !== 0}
                />
              </CCol>
              <CCol className="d-flex justify-content-end">
                <CFormLabel>총 {totalAdminElements} 개의 검색 결과</CFormLabel>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={columnSorterCustomProps}
                columns={adminColumnConfig}
                items={adminList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 관리자 수"
                itemsPerPageSelect
                loading={isLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={adminList.length}
                    isSearchPerformed={isSearchPerformed}
                    defaultMessage="검색 조건에 맞는 관리자를 검색합니다."
                  />
                }
                onItemsPerPageChange={handlePageSizeChange}
                onSelectedItemsChange={setCheckedItems}
                onSorterChange={handlePageSortChange}
                paginationProps={smartPaginationProps}
                selectable
                selected={checkedItems}
                scopedColumns={scopedColumns}
                tableProps={tableCustomProps}
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
