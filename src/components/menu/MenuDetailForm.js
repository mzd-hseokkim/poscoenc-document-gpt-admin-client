import React, { useEffect, useState } from 'react';

import { CButton, CCol, CFormCheck, CFormSelect, CMultiSelect, CRow, CSpinner } from '@coreui/react-pro';

import { useToast } from '../../context/ToastContext';
import MenuService from '../../services/menu/MenuService';
import RoleService from '../../services/Role/RoleService';
import { getAuditFields } from '../../utils/common/auditFieldUtils';
import formModes from '../../utils/formModes';
import InputList from '../input/InputList';

const MenuDetailForm = ({ selectedId, initialFormMode, closeModal, fetchMenuList }) => {
  const [formData, setFormData] = useState({ allowChildren: false });
  const [formMode, setFormMode] = useState(initialFormMode);
  const [roles, setRoles] = useState([]);
  const [parentMenus, setParentMenus] = useState(['상위 메뉴를 선택하세요.', { label: '선택하지 않음', value: '0' }]);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const menuBasicFields = [
    {
      name: 'id',
      label: '아이디',
      isDisabled: isUpdateMode,
      isRendered: !isCreateMode,
    },
    {
      name: 'name',
      label: '이름',
      placeholder: '이름을 입력하세요.',
    },
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
      value: formData.allowChildren ? '' : formData.urlPath,
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

  useEffect(() => {
    setIsLoading(false);
    if (!isCreateMode && selectedId) {
      fetchMenuDetail();
    } else {
      getRoles();
    }
    getParentMenu();
  }, [selectedId]);

  const fetchMenuDetail = async () => {
    try {
      setIsLoading(true);
      const data = await MenuService.getMenuDetail(selectedId);
      setFormData(data);
      const allowedRoles = data.allowedRoles.map((role) => role.id);
      await getRoles(allowedRoles);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setIsLoading(false);
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
      addToast({ color: 'danger', message: error });
    }
  };

  const getParentMenu = async () => {
    let excludedId = isCreateMode ? '' : selectedId;

    try {
      const data = await MenuService.getParentMenus(excludedId);
      const newParentMenus = data.map((parentMenu) => ({
        value: parentMenu.id,
        label: parentMenu.name,
      }));
      setParentMenus((prevMenus) => [...prevMenus, ...newParentMenus]);
    } catch (error) {
      addToast({ color: 'danger', message: error });
    }
  };

  const postMenu = async () => {
    try {
      await MenuService.postMenu(formData);
      closeModal();
      fetchMenuList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '메뉴를 등록할 수 없습니다.' });
      }
      if (status === 409) {
        addToast({ message: '이미 존재하는 값입니다. 입력값을 다시 확인해주세요.' });
      }
    }
  };

  const patchMenu = async () => {
    try {
      await MenuService.patchMenu(formData);
      closeModal();
      fetchMenuList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '메뉴를 수정할 수 없습니다.' });
      }
      if (status === 409) {
        addToast({ message: '이미 존재하는 값입니다. 입력값을 다시 확인해주세요.' });
      }
    }
  };

  const handleMultiSelect = (list) => {
    const roleList = list.map((item) => item.value);
    setFormData((prev) => ({ ...prev, allowedRoles: roleList }));
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = () => {
    if (isCreateMode) {
      postMenu();
    } else if (isUpdateMode) {
      patchMenu();
    }
  };

  const handleUpdateClick = () => {
    setFormMode('update');
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await MenuService.deleteMenu(id, shouldDelete);
    } catch (error) {
      console.log(error);
    }
    closeModal();
    fetchMenuList();
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
        <CFormSelect
          id="parentId"
          name="parentId"
          label="상위 메뉴"
          options={parentMenus}
          onChange={handleChange}
        ></CFormSelect>
      </CCol>
    </CRow>
  );

  return (
    <>
      {isLoading && <CSpinner />}
      {!isLoading && (
        <>
          <InputList fields={menuBasicFields} formData={formData} handleChange={handleChange} isReadMode={isReadMode} />
          <CRow className="mb-3">
            <CCol>
              <CFormCheck
                name="allowChildren"
                id="allowChildren"
                label="하위 메뉴 등록 가능 여부"
                checked={formData.allowChildren}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <InputList
            fields={menuSettingFields}
            formData={formData}
            handleChange={handleChange}
            isReadMode={isReadMode}
          />
          {renderRoleSelect()}
          {renderParentSelect()}
          <InputList
            fields={getAuditFields(formMode)}
            formData={formData}
            handleChange={handleChange}
            isReadMode={isReadMode}
          />
          <CRow>
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              {!isCreateMode && (
                <>
                  <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>
                    {formData.deleted ? '복구' : '삭제'}
                  </CButton>
                </>
              )}
              {isUpdateMode || isCreateMode ? (
                <CButton onClick={handleSubmit}>저장</CButton>
              ) : (
                <CButton onClick={handleUpdateClick}>수정</CButton>
              )}
            </CCol>
          </CRow>
        </>
      )}
    </>
  );
};

export default MenuDetailForm;
