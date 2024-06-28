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
import DeletionStatusBadge from 'components/badge/DeletionStatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import MenuDetailForm from 'components/menu/MenuDetailForm';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
import { format } from 'date-fns';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import MenuService from 'services/menu/MenuService';
import { formatToIsoEndDate, formatToIsoStartDate, getCurrentDate, getOneYearAgoDate } from 'utils/common/dateUtils';
import { iconMapper } from 'utils/common/iconMapper';
import { CommonColumnSorterCustomProps, CommonTableCustomProps } from 'utils/common/smartTablePropsConfig';
import { menuColumnConfig } from 'views/pages/menu/menuColumnConfig';

const createInitialSearchFormData = () => ({
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

const MenuManagementPage = () => {
  const [menuList, setMenuList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [formMode, setFormMode] = useState('');
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [totalMenuElements, setTotalMenuElements] = useState(0);
  const [searchFormData, setSearchFormData] = useState({});
  const [stagedSearchFormData, setStagedSearchFormData] = useState(createInitialSearchFormData);
  const [isPickTime, setIsPickTime] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isComponentMounted = useRef(true);
  const isSearchPerformed = useRef(false);

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } = usePagination(
    totalMenuElements,
    'id,desc'
  );
  const { addToast } = useToast();

  const modal = useModal();

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const fetchMenuList = useCallback(async () => {
    setSearchResultIsLoading(true);

    if (!isSearchPerformed.current) {
      isSearchPerformed.current = true;
    }

    try {
      const data = await MenuService.getMenus(searchFormData, pageableData);
      setMenuList(data.content);
      setTotalMenuElements(data.totalElements);
    } catch (error) {
      setHasError(true);
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: error.response.data.message });
      }
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [addToast, searchFormData, pageableData]);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      if (!hasError) {
        void fetchMenuList();
      }
    }
  }, [fetchMenuList, hasError]);

  const handleDateChange = (id, newDate, isStartDate = true) => {
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
      modifiedAt: isStartDate ? 'fromModifiedAt' : 'toModifiedAt',
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
      fromModifiedAt: format(stagedSearchFormData.fromModifiedAt, "yyyy-MM-dd'T'00:00"),
      toModifiedAt: format(stagedSearchFormData.toModifiedAt, "yyyy-MM-dd'T'23:59"),
      fromCreatedAt: format(stagedSearchFormData.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(stagedSearchFormData.toCreatedAt, "yyyy-MM-dd'T'23:59"),
    }));
  };

  const handleChange = ({ target: { id, value } }) => {
    setStagedSearchFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRowClick = (id) => {
    setFormMode('read');
    modal.openModal(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasError(false);
    setSearchFormData(stagedSearchFormData);
  };

  const handleReset = () => {
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
      await MenuService.deleteMenus(ids, shouldDelete);
      fetchMenuList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
      }
    }
    setCheckedItems([]);
  };

  const scopedColumns = {
    name: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        {item.name}
      </td>
    ),
    icon: (item) => <td>{iconMapper({ iconName: item.icon })}</td>,
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
                    id="name"
                    placeholder=""
                    floatingLabel="이름"
                    onChange={handleChange}
                    value={stagedSearchFormData.name}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    min={0}
                    type="number"
                    id="menuOrder"
                    placeholder=""
                    floatingLabel="메뉴 순서"
                    onChange={handleChange}
                    value={stagedSearchFormData.menuOrder}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    min={0}
                    type="number"
                    id="parentId"
                    placeholder=""
                    onChange={handleChange}
                    floatingLabel="상위 메뉴 ID"
                    value={stagedSearchFormData.parentId}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3 align-items-center">
                <CCol md={8}>
                  <CFormInput
                    id="urlPath"
                    placeholder=""
                    floatingLabel="경로 (Url)"
                    onChange={handleChange}
                    value={stagedSearchFormData.urlPath}
                  />
                </CCol>
                <CCol md={4} style={{ paddingBottom: '10px' }}>
                  <CFormSelect
                    id="deletionOption"
                    label="삭제된 메뉴 검색"
                    name="deletionOption"
                    options={[
                      { label: '선택하지 않음', value: '' },
                      { label: '예', value: 'YES' },
                      { label: '아니오', value: 'NO' },
                    ]}
                    value={stagedSearchFormData.deletionOption}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={5}>
                  <CDateRangePicker
                    key={`createdAt-${isPickTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={stagedSearchFormData.fromCreatedAt}
                    endDate={stagedSearchFormData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange('createdAt', newDate, true)}
                    onEndDateChange={(newDate) => handleDateChange('createdAt', newDate, false)}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={5}>
                  <CDateRangePicker
                    key={`modifiedAt-${isPickTime}`}
                    id="modifiedAt"
                    label="수정일"
                    startDate={stagedSearchFormData.fromModifiedAt}
                    endDate={stagedSearchFormData.toModifiedAt}
                    onStartDateChange={(newDate) => handleDateChange('modifiedAt', newDate, true)}
                    onEndDateChange={(newDate) => handleDateChange('modifiedAt', newDate, false)}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={2} className="mt-5">
                  <CFormCheck label="시간 검색 여부" checked={isPickTime} onChange={(e) => handleTimePickerCheck(e)} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton color="primary" value="Reset" onClick={handleReset}>
                    초기화
                  </CButton>
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
                <CButton onClick={handleCreateClick}>메뉴 추가</CButton>
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
                  downloadFunction={MenuService.getDownloadSearchedMenuList}
                  searchFormData={searchFormData}
                  hasSearchResults={menuList.length !== 0}
                />
              </CCol>
              <CCol className="d-flex justify-content-end">
                <CFormLabel>총 {totalMenuElements} 개의 검색 결과</CFormLabel>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columns={menuColumnConfig}
                columnSorter={CommonColumnSorterCustomProps}
                items={menuList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 메뉴 개수"
                itemsPerPageSelect
                loading={searchResultIsLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={menuList.length}
                    isSearchPerformed={isSearchPerformed.current}
                    defaultMessage="검색 조건에 맞는 메뉴를 검색합니다."
                  />
                }
                onItemsPerPageChange={handlePageSizeChange}
                onSelectedItemsChange={setCheckedItems}
                onSorterChange={handlePageSortChange}
                paginationProps={smartPaginationProps}
                selectable
                scopedColumns={scopedColumns}
                selected={checkedItems}
                tableProps={CommonTableCustomProps}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>

      <ModalContainer visible={modal.isOpen} title="메뉴 정보" size="lg" onClose={modal.closeModal}>
        <MenuDetailForm initialFormMode={formMode} closeModal={modal.closeModal} fetchMenuList={fetchMenuList} />
      </ModalContainer>
    </>
  );
};

export default MenuManagementPage;
