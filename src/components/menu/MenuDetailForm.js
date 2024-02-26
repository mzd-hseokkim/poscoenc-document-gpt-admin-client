import React, { useEffect, useState } from 'react';

import {
  CButton,
  CCol,
  CElementCover,
  CForm,
  CFormCheck,
  CFormSelect,
  CMultiSelect,
  CRow,
  CSpinner,
} from '@coreui/react-pro';
import { Controller, useForm } from 'react-hook-form';

import { useToast } from '../../context/ToastContext';
import MenuService from '../../services/menu/MenuService';
import RoleService from '../../services/Role/RoleService';
import { getAuditFields } from '../../utils/common/auditFieldUtils';
import formModes from '../../utils/formModes';
import { itemNameValidationPattern } from '../../utils/validationUtils';
import InputList from '../input/InputList';

const MenuDetailForm = ({ selectedId, initialFormMode, closeModal, fetchMenuList }) => {
  const [formData, setFormData] = useState({ allowChildren: false });
  const [formMode, setFormMode] = useState(initialFormMode);
  const [roles, setRoles] = useState([]);
  const [parentMenus, setParentMenus] = useState([
    { label: '상위 메뉴를 선택하세요.' },
    { label: '선택하지 않음', value: 0 },
  ]);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

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
      rules: {
        required: '이름은 필수 입력 항목입니다.',
        pattern: {
          value: itemNameValidationPattern,
          message: '한글, 알파벳, 숫자, 띄어쓰기만 허용됩니다.',
        },
      },
    },
    {
      name: 'icon',
      label: '아이콘',
      placeholder: 'e.g. cilUser',
      rules: {
        required: '아이콘은 필수 입력 항목입니다.',
      },
    },
  ];

  const menuSettingFields = [
    {
      name: 'urlPath',
      label: 'URL',
      placeholder: formData.allowChildren ? '메뉴 주소를 입력할 수 없습니다.' : '메뉴 주소를 입력하세요.',
      isDisabled: formData.allowChildren,
      rules: {
        required: {
          value: !formData.allowChildren,
          message: 'URL은 필수 입력 항목입니다.',
        },
      },
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
      rules: {
        required: '메뉴 순서는 필수 입력 항목입니다.',
      },
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
      reset(data);
      const allowedRoles = data.allowedRoles.map((role) => role.id);
      await getRoles(allowedRoles);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '메뉴 정보를 가져오지 못했습니다.' });
      }
      if (status === 404) {
        addToast({ message: '메뉴를 찾을 수 없습니다.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoles = async (allowedRoles) => {
    try {
      const rolesData = await RoleService.getRoles();
      const newRoles = rolesData.map((role) => ({
        value: role.id,
        text: role.role,
        selected: allowedRoles?.length > 0 ? allowedRoles.includes(role.id) : false,
      }));
      setRoles(newRoles);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '권한 목록을 가져오지 못했습니다.' });
      }
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
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '상위 메뉴 목록을 가져오지 못했습니다.' });
      }
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
    }
  };

  const handleMultiSelect = (list) => {
    const roleList = list.map((item) => item.value);
    setFormData((prev) => ({ ...prev, allowedRoles: roleList }));
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev };

      if (type === 'checkbox') {
        updatedFormData[name] = checked;
        if (name === 'allowChildren') {
          updatedFormData.urlPath = checked ? '' : prev.urlPath;
        }
      } else {
        updatedFormData[name] = value;
      }

      return updatedFormData;
    });
  };

  const onSubmit = () => {
    if (isCreateMode) {
      postMenu();
    } else if (isUpdateMode) {
      patchMenu();
    }
  };

  const handleCancelClick = () => {
    setFormMode('read');
    fetchMenuDetail();
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setFormMode('update');
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await MenuService.deleteMenu(id, shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    closeModal();
    fetchMenuList();
  };

  const renderRoleSelect = () => (
    <CRow className="mb-3">
      <CCol>
        <Controller
          name="allowedRoles"
          control={control}
          rules={{ required: '권한은 필수 입력 항목입니다.' }}
          render={({ field: { onChange } }) => (
            <CMultiSelect
              id="allowedRoles"
              name="allowedRoles"
              options={roles}
              label="인가된 권한"
              placeholder="권한을 선택하세요."
              selectAllLabel="모두 선택"
              virtualScroller
              onChange={(e) => {
                onChange(e);
                handleMultiSelect(e);
              }}
              disabled={isReadMode}
              invalid={errors.allowedRoles}
              feedbackInvalid={errors.allowedRoles && errors.allowedRoles.message}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  const renderParentSelect = () => (
    <CRow className="mb-3">
      <CCol>
        <Controller
          name="parentId"
          control={control}
          rules={{ required: '상위 메뉴 선택은 필수입니다.' }}
          render={({ field: { onChange } }) => (
            <CFormSelect
              id="parentId"
              name="parentId"
              label="상위 메뉴"
              options={parentMenus}
              onChange={(e) => {
                onChange(e);
                handleChange(e);
              }}
              value={formData.parentId}
              disabled={isReadMode}
              invalid={errors.parentId}
              feedbackInvalid={errors.parentId && errors.parentId.message}
            ></CFormSelect>
          )}
        ></Controller>
      </CCol>
    </CRow>
  );

  return (
    <>
      {isLoading && (
        <CElementCover>
          <CSpinner variant="grow" color="primary" />
        </CElementCover>
      )}

      <CForm onSubmit={handleSubmit(onSubmit)}>
        <InputList
          fields={menuBasicFields}
          formData={formData}
          handleChange={handleChange}
          isReadMode={isReadMode}
          control={control}
          errors={errors}
        />
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
          control={control}
          errors={errors}
        />
        {renderRoleSelect()}
        {renderParentSelect()}
        <InputList
          fields={getAuditFields(formMode)}
          formData={formData}
          handleChange={handleChange}
          isReadMode={isReadMode}
          control={control}
          errors={errors}
        />
        <CRow>
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            {isUpdateMode && <CButton onClick={handleCancelClick}>취소</CButton>}
            {!isCreateMode && (
              <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>
                {formData.deleted ? '복구' : '삭제'}
              </CButton>
            )}
            {isReadMode ? <CButton onClick={handleUpdateClick}>수정</CButton> : <CButton type="submit">저장</CButton>}
          </CCol>
        </CRow>
      </CForm>
    </>
  );
};

export default MenuDetailForm;
