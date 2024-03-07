import React, { useEffect, useState } from 'react';

import {
  CCol,
  CForm,
  CFormCheck,
  CFormLabel,
  CFormSelect,
  CModalBody,
  CModalFooter,
  CMultiSelect,
  CRow,
} from '@coreui/react-pro';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import InputList from 'components/input/InputList';
import { useToast } from 'context/ToastContext';
import { Controller, useForm } from 'react-hook-form';
import MenuService from 'services/menu/MenuService';
import RoleService from 'services/Role/RoleService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/formModes';
import { itemNameValidationPattern } from 'utils/validationUtils';

const MenuDetailForm = ({ selectedId, initialFormMode, closeModal, fetchMenuList }) => {
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
    watch,
    setValue,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      allowChildren: false,
    },
  });

  const allowChildren = watch('allowChildren');
  const deleted = watch('deleted');

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
      placeholder: allowChildren ? '메뉴 주소를 입력할 수 없습니다.' : '메뉴 주소를 입력하세요.',
      isDisabled: allowChildren,
      rules: {
        required: {
          value: !allowChildren,
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
    if (allowChildren) {
      setValue('urlPath', '', { shouldValidate: true });
    }
  }, [allowChildren, setValue]);

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
      const formattedData = {
        ...data,
        modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
        createdAt: data.createdAt && formatToYMD(data.createdAt),
      };
      reset(formattedData);
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

  const postMenu = async (data) => {
    try {
      await MenuService.postMenu(data);
      closeModal();
      fetchMenuList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '메뉴를 등록할 수 없습니다.' });
      }
    }
  };

  const patchMenu = async (data) => {
    try {
      await MenuService.patchMenu(data);
      closeModal();
      fetchMenuList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '메뉴를 수정할 수 없습니다.' });
      }
    }
  };

  const onSubmit = (data) => {
    const roleList = data.allowedRoles?.map((item) => item.value);
    const updatedData = { ...data, allowedRoles: roleList };

    if (isCreateMode) {
      postMenu(updatedData);
    } else if (isUpdateMode) {
      patchMenu(updatedData);
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
    const shouldDelete = !deleted;
    try {
      await MenuService.deleteMenu(id, shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    closeModal();
    fetchMenuList();
  };
  const renderAllowChildrenCheck = () => (
    <CRow className="mb-3">
      <CFormLabel htmlFor="detail-form-allowChildren" className="col-md-3 col-form-label fw-bold">
        하위 메뉴 등록 가능 여부
      </CFormLabel>
      <CCol>
        <Controller
          name="allowChildren"
          control={control}
          render={({ field }) => (
            <CCol className="mt-2">
              <CFormCheck {...field} id="detail-form-allowChildren" checked={field.value} disabled={isReadMode} />
            </CCol>
          )}
        />
      </CCol>
    </CRow>
  );

  const renderRoleSelect = () => (
    <CRow className="mb-3">
      <CFormLabel htmlFor="detail-form-allowedRoles" className="col-md-2 col-form-label fw-bold">
        인가된 권한
      </CFormLabel>
      <CCol>
        <Controller
          name="allowedRoles"
          control={control}
          rules={{ required: '권한은 필수 입력 항목입니다.' }}
          render={({ field }) => (
            <CMultiSelect
              {...field}
              id="detail-form-allowedRoles"
              placeholder="권한을 선택하세요."
              selectAllLabel="모두 선택"
              options={roles}
              virtualScroller
              disabled={isReadMode}
              invalid={!!errors.allowedRoles}
              feedbackInvalid={errors.allowedRoles?.message}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  const renderParentSelect = () => (
    <CRow className="mb-3">
      <CFormLabel htmlFor="detail-form-parentId" className="col-md-2 col-form-label fw-bold">
        상위 메뉴
      </CFormLabel>
      <CCol>
        <Controller
          name="parentId"
          control={control}
          rules={{ required: '상위 메뉴 선택은 필수 입력 항목입니다.' }}
          render={({ field }) => (
            <CFormSelect
              {...field}
              id="detail-form-parentId"
              options={parentMenus}
              disabled={isReadMode}
              invalid={!!errors.parentId}
              feedbackInvalid={errors.parentId?.message}
            ></CFormSelect>
          )}
        ></Controller>
      </CCol>
    </CRow>
  );

  return (
    <>
      <FormLoadingCover isLoading={isLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <InputList fields={menuBasicFields} isReadMode={isReadMode} register={register} errors={errors} />
          {renderAllowChildrenCheck()}
          <InputList fields={menuSettingFields} isReadMode={isReadMode} register={register} errors={errors} />
          {renderRoleSelect()}
          {renderParentSelect()}
          <InputList fields={getAuditFields(formMode)} isReadMode={isReadMode} register={register} errors={errors} />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={selectedId}
          formModes={formModes(formMode)}
          handleCancel={handleCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={handleUpdateClick}
          isDataDeleted={deleted}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};

export default MenuDetailForm;
