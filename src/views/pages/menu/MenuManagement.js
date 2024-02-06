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
import React, { useState } from 'react';
import { format } from 'date-fns';
import useToast from '../../../hooks/useToast';
import MenuService from '../../../services/menu/MenuService';
import ModalContainer from '../../../components/modal/ModalContainer';
import useModal from '../../../hooks/useModal';
import MenuDetailForm from '../../../components/menu/MenuDetailForm';

const columns = [
  {
    key: 'id',
    label: '아이디',
  },
  {
    key: 'name',
    label: '이름',
  },
  {
    key: 'icon',
    label: '아이콘',
  },
  {
    key: 'urlPath',
    label: 'URL',
  },
  {
    key: 'parentId',
    label: '상위 메뉴 아이디',
  },
  {
    key: 'menuOrder',
    label: '메뉴 순서',
  },
];

const MenuManagement = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [menuList, setMenuList] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [formMode, setFormMode] = useState('default');

  const addToast = useToast();
  const modal = useModal();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await MenuService.getMenuList(formData);
      setMenuList(data.content);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ color: 'danger', body: error.response.data.message });
      }
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

  return (
    <>
      <CCard className="row g-3">
        <CCardBody>
          <CCardTitle>메뉴 관리</CCardTitle>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={4} className="position-relative">
                <CFormInput id="name" label="이름" onChange={handleChange} />
              </CCol>
              <CCol md={4} className="position-relative">
                <CFormInput type="number" id="menuOrder" label="메뉴 순서" onChange={handleChange} />
              </CCol>
              <CCol md={4} className="position-relative">
                <CFormInput type="number" id="parentId" label="상위 메뉴 ID" onChange={handleChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={8} className="position-relative">
                <CFormInput id="urlPath" label="경로" onChange={handleChange} />
              </CCol>
              <CCol md={4} className="position-relative">
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
              <CCol md={6} className="position-relative">
                <CDateRangePicker
                  id="createdAt"
                  label="생성 일시"
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={(newDate) => handleStartDateChange({ id: 'createdAt', newDate })}
                  onEndDateChange={(newDate) => handleEndDateChange({ id: 'createdAt', newDate })}
                />
              </CCol>
              <CCol md={6} className="position-relative">
                <CDateRangePicker
                  label="수정 일시"
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={(newDate) => handleStartDateChange({ id: 'modifiedAt', newDate })}
                  onEndDateChange={(newDate) => handleEndDateChange({ id: 'modifiedAt', newDate })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton type="submit">검색</CButton>
                <CButton color="primary" value="Reset" onClick={handleReset}>
                  초기화
                </CButton>
              </div>
            </CRow>
          </CForm>
          <CRow className="mb-3">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton onClick={handleCreateClick}>메뉴 추가</CButton>
            </div>
          </CRow>
          <CRow className="mb-3">
            <CSmartTable
              activePage={2}
              clickableRows
              columns={columns}
              columnSorter={false}
              items={menuList}
              itemsPerPageSelect
              itemsPerPage={5}
              pagination
              onFilteredItemsChange={(items) => {
                console.log(items);
              }}
              onSelectedItemsChange={(items) => {
                console.log(items);
              }}
              selectable
              sorterValue={{ column: 'id', state: 'asc' }}
              tableProps={{
                responsive: true,
                striped: true,
                hover: true,
              }}
              tableBodyProps={{
                className: 'align-middle',
              }}
              onRowClick={(row) => handleRowClick(row.id)}
            />
          </CRow>
        </CCardBody>
      </CCard>
      <ModalContainer visible={modal.isOpen} title="메뉴 정보" onClose={modal.closeModal}>
        <MenuDetailForm selectedId={selectedId} initialFormMode={formMode} />
      </ModalContainer>
    </>
  );
};

export default MenuManagement;
