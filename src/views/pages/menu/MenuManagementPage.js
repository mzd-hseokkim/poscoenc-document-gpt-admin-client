//MenuManagement

import React, { useEffect, useRef, useState } from 'react';

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

import StatusBadge from '../../../components/board/BoadStatusBadge';
import MenuDetailForm from '../../../components/menu/MenuDetailForm';
import ModalContainer from '../../../components/modal/ModalContainer';
import useModal from '../../../hooks/useModal';
import useToast from '../../../hooks/useToast';
import MenuService from '../../../services/menu/MenuService';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  getCurrentDate,
  getOneYearAgoDate,
} from '../../../utils/common/dateUtils';
import { iconMapper } from '../../../utils/common/iconMapper';
import { menuColumnConfig } from '../../../utils/menu/menuColumnConfig';

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
  const [selectedId, setSelectedId] = useState();
  const [formMode, setFormMode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalMenuElements, setTotalMenuElements] = useState(0);
  const [formData, setFormData] = useState(createInitialFormData);
  const [pageableData, setPageableData] = useState({
    page: 0,
    size: 10,
    sort: 'name,asc',
  });
  const isComponentMounted = useRef(true);

  const addToast = useToast();
  const modal = useModal();

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      fetchMenuList();
    }
  }, [pageableData]);

  const fetchMenuList = async () => {
    try {
      setIsLoading(true);
      const data = await MenuService.getMenus(formData, pageableData);
      setMenuList(data.content);
      setTotalMenuElements(data.totalElements);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ color: 'danger', body: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (sorterValue) => {
    const newSortValue = `${sorterValue.column},${sorterValue.state}`;
    setPageableData((prev) => ({
      ...prev,
      sort: newSortValue,
    }));
  };

  const handleSizeChange = (size) => {
    setPageableData((prev) => ({ ...prev, size, page: 0 }));
  };

  const handlePageChange = (page) => {
    setPageableData((prev) => ({ ...prev, page: page - 1 }));
  };

  const handleDateChange = ({ id, newDate, isStartDate = true }) => {
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

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRowClick = (id) => {
    setSelectedId(id);
    setFormMode('read');
    modal.openModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMenuList();
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
        console.log(error);
      }
    } else {
      try {
        await MenuService.deleteMenus(ids, shouldDelete);
        fetchMenuList();
      } catch (error) {
        console.log(error);
      }
    }
    setCheckedItems([]);
  };

  return (
    <>
      <CCard className="row g-3">
        <CCardBody>
          <CCardTitle>메뉴 관리</CCardTitle>
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
              <CCol md={6}>
                <CDateRangePicker
                  id="createdAt"
                  label="생성일"
                  startDate={formData.fromCreatedAt}
                  endDate={formData.toCreatedAt}
                  onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                  onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                />
              </CCol>
              <CCol md={6}>
                <CDateRangePicker
                  id="modifiedAt"
                  label="수정일"
                  startDate={formData.fromModifiedAt}
                  endDate={formData.toModifiedAt}
                  onStartDateChange={(newDate) => handleDateChange({ id: 'modifiedAt', newDate })}
                  onEndDateChange={(newDate) => handleDateChange({ id: 'modifiedAt', newDate, isStartDate: false })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton type="submit">검색</CButton>
                <CButton color="primary" value="Reset" onClick={handleReset}>
                  초기화
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          <CRow className="mb-3">
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton onClick={handleCreateClick}>메뉴 추가</CButton>
              <CButton onClick={() => handleDeleteRestoreClick(true)}>삭제</CButton>
              <CButton onClick={() => handleDeleteRestoreClick(false)}>복구</CButton>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CSmartTable
              columnSorter={{
                external: true,
                resetable: false,
              }}
              onSorterChange={(sorterValue) => handleSortChange(sorterValue)}
              itemsPerPageSelect
              paginationProps={{
                activePage: pageableData.page + 1,
                pages: Math.ceil(totalMenuElements / pageableData.size) || 1,
                onActivePageChange: handlePageChange,
              }}
              itemsPerPage={pageableData.size}
              onItemsPerPageChange={handleSizeChange}
              itemsPerPageLabel="페이지당 메뉴 개수"
              noItemsLabel="검색 결과가 없습니다."
              loading={isLoading}
              items={menuList}
              columns={menuColumnConfig}
              selectable
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
      <ModalContainer visible={modal.isOpen} title="메뉴 정보" onClose={modal.closeModal}>
        <MenuDetailForm
          selectedId={selectedId}
          initialFormMode={formMode}
          closeModal={modal.closeModal}
          fetchMenuList={fetchMenuList}
        />
      </ModalContainer>
    </>
  );
};

export default MenuManagementPage;
