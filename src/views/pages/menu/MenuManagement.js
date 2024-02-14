import React, { useEffect, useState } from 'react';

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
import MenuDetailForm from '../../../components/menu/MenuDetailForm';
import ModalContainer from '../../../components/modal/ModalContainer';
import useModal from '../../../hooks/useModal';
import useToast from '../../../hooks/useToast';
import MenuService from '../../../services/menu/MenuService';
import { menuColumnUtils } from '../../../utils/menu/menuColumnUtils';

const MenuManagement = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [menuList, setMenuList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [formMode, setFormMode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const initialFormData = {
    name: '',
    urlPath: '',
    menuOrder: '',
    parentId: '',
    fromCreatedAt: format(startDate, "yyyy-MM-dd'T'00:00"),
    toCreatedAt: format(endDate, "yyyy-MM-dd'T'23:59"),
    fromModifiedAt: format(startDate, "yyyy-MM-dd'T'00:00"),
    toModifiedAt: format(endDate, "yyyy-MM-dd'T'23:59"),
    deletionOption: 'ALL',
  };
  const [formData, setFormData] = useState(initialFormData);

  const addToast = useToast();
  const modal = useModal();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    getMenuList();
  };

  const getMenuList = async () => {
    try {
      setIsLoading(true);
      const data = await MenuService.getMenuList(formData);
      setMenuList(data.content);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ color: 'danger', body: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartDateChange = ({ id, newDate }) => {
    if (id === 'createdAt') {
      setFormData((prev) => ({
        ...prev,
        fromCreatedAt: format(new Date(newDate), "yyyy-MM-dd'T'00:00"),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        fromModifiedAt: format(new Date(newDate), "yyyy-MM-dd'T'00:00"),
      }));
    }
  };

  const handleEndDateChange = ({ id, newDate }) => {
    if (id === 'createdAt') {
      setFormData((prev) => ({
        ...prev,
        toCreatedAt: format(new Date(newDate), "yyyy-MM-dd'T'23:59"),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        toModifiedAt: format(new Date(newDate), "yyyy-MM-dd'T'23:59"),
      }));
    }
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
        await MenuService.deleteSingleMenu(ids, shouldDelete);
        getMenuList();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await MenuService.deleteMultipleMenu(ids, shouldDelete);
        getMenuList();
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
                <CFormInput id="name" label="이름" onChange={handleChange} />
              </CCol>
              <CCol md={4}>
                <CFormInput type="number" id="menuOrder" label="메뉴 순서" onChange={handleChange} />
              </CCol>
              <CCol md={4}>
                <CFormInput type="number" id="parentId" label="상위 메뉴 ID" onChange={handleChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={8}>
                <CFormInput id="urlPath" label="경로" onChange={handleChange} />
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
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CDateRangePicker
                  id="createdAt"
                  label="생성일"
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={(newDate) => handleStartDateChange({ id: 'createdAt', newDate })}
                  onEndDateChange={(newDate) => handleEndDateChange({ id: 'createdAt', newDate })}
                />
              </CCol>
              <CCol md={6}>
                <CDateRangePicker
                  label="수정일"
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={(newDate) => handleStartDateChange({ id: 'modifiedAt', newDate })}
                  onEndDateChange={(newDate) => handleEndDateChange({ id: 'modifiedAt', newDate })}
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
              pagination
              activePage={1}
              itemsPerPageSelect
              itemsPerPage={10}
              itemsPerPageLabel={'페이지당 메뉴 개수'}
              loading={isLoading}
              sorterValue={{ column: 'id', state: 'asc' }}
              items={menuList}
              columns={menuColumnUtils}
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
      <ModalContainer visible={modal.isOpen} title="메뉴 정보" onClose={modal.closeModal}>
        <MenuDetailForm selectedId={selectedId} initialFormMode={formMode} closeModal={modal.closeModal} />
      </ModalContainer>
    </>
  );
};

export default MenuManagement;
