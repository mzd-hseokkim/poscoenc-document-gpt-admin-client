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
import StatusBadge from 'components/badge/StatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import MenuDetailForm from 'components/menu/MenuDetailForm';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
import { format } from 'date-fns';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import MenuService from 'services/menu/MenuService';
import { formatToIsoEndDate, formatToIsoStartDate, getCurrentDate, getOneYearAgoDate } from 'utils/common/dateUtils';
import { iconMapper } from 'utils/common/iconMapper';
import { menuColumnConfig } from 'utils/menu/menuColumnConfig';

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

const MenuManagementPage = () => {
  const [menuList, setMenuList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [formMode, setFormMode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalMenuElements, setTotalMenuElements] = useState(0);
  const [formData, setFormData] = useState(createInitialFormData);
  const [noItemsLabel, setNoItemsLabel] = useState('');
  const [isSelectTime, setIsSelectTime] = useState(false);

  const isComponentMounted = useRef(true);

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalMenuElements);
  const { addToast } = useToast();
  const modal = useModal();

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void fetchMenuList();
    }
  }, [pageableData]);

  const fetchMenuList = async () => {
    try {
      setIsLoading(true);
      const data = await MenuService.getMenus(formData, pageableData);
      setMenuList(data.content);
      setTotalMenuElements(data.totalElements);
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

  const handleDateChange = (id, newDate, isStartDate = true) => {
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
      modifiedAt: isStartDate ? 'fromModifiedAt' : 'toModifiedAt',
    };

    const fieldToUpdate = fieldMap[id];
    if (fieldToUpdate) {
      const formattedDate = isStartDate ? formatToIsoStartDate(newDate) : formatToIsoEndDate(newDate);
      setFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
    }
  };

  const handleTimePickerCheck = (e) => {
    setIsSelectTime(e.target.checked);
    setFormData((prev) => ({
      ...prev,
      fromModifiedAt: format(formData.fromModifiedAt, "yyyy-MM-dd'T'00:00"),
      toModifiedAt: format(formData.toModifiedAt, "yyyy-MM-dd'T'23:59"),
      fromCreatedAt: format(formData.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(formData.toCreatedAt, "yyyy-MM-dd'T'23:59"),
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
    void fetchMenuList();
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
        await MenuService.deleteMenu(ids, shouldDelete);
        fetchMenuList();
      } catch (error) {
        const status = error.response?.status;
        if (status === 400) {
          addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
        }
      }
    } else {
      try {
        await MenuService.deleteMenus(ids, shouldDelete);
        fetchMenuList();
      } catch (error) {
        const status = error.response?.status;
        if (status === 400) {
          addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
        }
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
                  <CFormInput id="name" label="이름" value={formData.name} onChange={handleChange} />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    id="menuOrder"
                    label="메뉴 순서"
                    min={0}
                    value={formData.menuOrder}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    id="parentId"
                    label="상위 메뉴 ID"
                    min={0}
                    value={formData.parentId}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={8}>
                  <CFormInput id="urlPath" label="경로" value={formData.urlPath} onChange={handleChange} />
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    id="deletionOption"
                    label="삭제된 메뉴 검색"
                    name="deletionOption"
                    options={[
                      { label: '선택하지 않음', value: '' },
                      { label: '예', value: 'YES' },
                      { label: '아니오', value: 'NO' },
                    ]}
                    value={formData.deletionOption}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={5}>
                  <CDateRangePicker
                    key={`createdAt-${isSelectTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={formData.fromCreatedAt}
                    endDate={formData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange('createdAt', newDate, true)}
                    onEndDateChange={(newDate) => handleDateChange('createdAt', newDate, false)}
                    timepicker={isSelectTime}
                  />
                </CCol>
                <CCol md={5}>
                  <CDateRangePicker
                    key={`modifiedAt-${isSelectTime}`}
                    id="modifiedAt"
                    label="수정일"
                    startDate={formData.fromModifiedAt}
                    endDate={formData.toModifiedAt}
                    onStartDateChange={(newDate) => handleDateChange('modifiedAt', newDate, true)}
                    onEndDateChange={(newDate) => handleDateChange('modifiedAt', newDate, false)}
                    timepicker={isSelectTime}
                  />
                </CCol>
                <CCol md={2} className="mt-5">
                  <CFormCheck
                    label="시간 검색 여부"
                    checked={isSelectTime}
                    onChange={(e) => handleTimePickerCheck(e)}
                  />
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
                <CButton onClick={() => handleDeleteRestoreClick(true)}>삭제</CButton>
                <CButton onClick={() => handleDeleteRestoreClick(false)}>복구</CButton>
                <ExcelDownloadCButton
                  downloadFunction={MenuService.getDownloadSearchedMenuList}
                  searchFormData={formData}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columns={menuColumnConfig}
                columnSorter={{
                  external: true,
                  resetable: false,
                }}
                items={menuList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 메뉴 개수"
                itemsPerPageSelect
                loading={isLoading}
                noItemsLabel={noItemsLabel}
                onItemsPerPageChange={handlePageSizeChange}
                onSelectedItemsChange={(items) => {
                  setCheckedItems(items);
                }}
                onSorterChange={(sorterValue) => handlePageSortChange(sorterValue)}
                paginationProps={smartPaginationProps}
                scopedColumns={{
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
                      <StatusBadge deleted={item.deleted} />
                    </td>
                  ),
                }}
                selected={checkedItems}
                tableProps={{
                  responsive: true,
                  hover: true,
                }}
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
