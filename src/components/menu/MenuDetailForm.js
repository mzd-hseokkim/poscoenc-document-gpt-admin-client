import React, { useEffect, useState } from 'react';
import { CButton, CCol, CFormCheck, CFormSelect, CMultiSelect, CRow } from '@coreui/react-pro';
import MenuService from '../../services/menu/MenuService';
import menuService from '../../services/menu/MenuService';
import RoleService from '../../services/Role/RoleService';
import InputList from '../input/InputList';
import formModes from '../../utils/formModes';

const MenuDetailForm = ({ selectedId, initialFormMode }) => {
  const [formData, setFormData] = useState([]);
  const [formMode, setFormMode] = useState(initialFormMode);
  const [roles, setRoles] = useState([]);
  const [parentMenus, setParentMenus] = useState([]);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);

  const fetchMenuDetail = async () => {
    try {
      const data = await MenuService.getSingleMenu(selectedId);
      setFormData(data);
      const allowedRoles = data.allowedRoles.map((role) => role.id);
      await getRoles(allowedRoles);
    } catch (error) {
      console.log(error);
    }
  };

  const getRoles = async (allowedRoles) => {
    try {
      const rolesData = await RoleService.getRoleList();
      const newRoles = rolesData.map((role) => ({
        value: role.id,
        text: role.role,
        selected: allowedRoles?.length > 0 ? allowedRoles.includes(role.id) : false,
      }));
      setRoles(newRoles);
    } catch (error) {
      console.log(error);
    }
  };

  const getParentMenu = async () => {
    let excludedId = isCreateMode ? '' : selectedId;

    try {
      const data = await MenuService.getParentMenu(excludedId);
      const newParentMenus = data.map((parentMenu) => ({
        value: parentMenu.id,
        label: parentMenu.name,
      }));
      setParentMenus(newParentMenus);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isCreateMode && selectedId) {
      fetchMenuDetail();
    } else {
      getRoles();
    }
    getParentMenu();
  }, [selectedId]);

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const menuBasicFields = [
    { name: 'id', label: '아이디', isDisabled: isUpdateMode, isRendered: !isCreateMode },
    { name: 'name', label: '이름', placeholder: '이름을 입력하세요.' },
    {
      name: 'icon',
      label: '아이콘',
      placeholder: 'e.g. cilUser',
      text: 'Must be 8-20 characters long.',
    },
  ];

  const menuSettingFields = [
    {
      name: 'urlPath',
      label: 'URL',
      placeholder: formData.allowChildren ? '메뉴 주소를 입력할 수 없습니다.' : '메뉴 주소를 입력하세요.',
      isDisabled: formData.allowChildren,
    },
    {
      name: 'parentId',
      label: '상위 메뉴',
      isRendered: isReadMode,
    },
    {
      name: 'menuOrder',
      label: '메뉴 순서',
      type: 'number',
      placeholder: '메뉴 순서를 숫자로 입력하세요',
    },
  ];

  const postMenu = async () => {
    try {
      await MenuService.createMenu(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const patchMenu = async () => {
    try {
      await menuService.updateMenu();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (isCreateMode) {
      postMenu();
    } else if (isUpdateMode) {
      patchMenu();
    }
  };

  const handleMultiSelect = (list) => {
    const roleList = list.map((item) => item.value);
    setFormData((prev) => ({ ...prev, allowedRoles: roleList }));
  };

  const renderRoleSelect = () => (
    <CRow className="mb-3">
      <CCol>
        <CMultiSelect
          options={roles}
          label="인가된 권한"
          placeholder="권한을 선택하세요."
          selectAllLabel="모두 선택"
          virtualScroller
          onChange={(values) => handleMultiSelect(values)}
          disabled={isReadMode}
        />
      </CCol>
    </CRow>
  );

  const renderParentSelect = () => (
    <CRow className="mb-3">
      <CCol>
        <CFormSelect name="parentId" label={'상위 메뉴'} options={parentMenus} onChange={handleChange} />
      </CCol>
    </CRow>
  );

  const handleUpdateClick = () => {
    setFormMode('update');
  };

  return (
    <>
      <InputList fields={menuBasicFields} formData={formData} handleChange={handleChange} isReadMode={isReadMode} />
      <CRow className="mb-3">
        <CCol>
          <CFormCheck
            label="하위 메뉴 등록"
            id="allowChildren"
            onChange={(e) => console.log(e.target.value)}
          ></CFormCheck>
        </CCol>
      </CRow>
      <InputList fields={menuSettingFields} formData={formData} handleChange={handleChange} isReadMode={isReadMode} />
      {renderRoleSelect()}
      {renderParentSelect()}
      <CRow>
        <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
          {isReadMode ? (
            <CButton color="primary" className="me-md-2" onClick={handleUpdateClick}>
              수정
            </CButton>
          ) : (
            <CButton color="primary" onClick={handleSubmit}>
              저장
            </CButton>
          )}
        </CCol>
      </CRow>
    </>
  );
};

export default MenuDetailForm;
