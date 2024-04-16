import React, { useCallback, useEffect, useState } from 'react';

import {
  CCard,
  CCardBody,
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
import FormInputGrid from 'components/input/FormInputGrid';
import { useToast } from 'context/ToastContext';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import MenuService from 'services/menu/MenuService';
import RoleService from 'services/role/RoleService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';
import { itemNameValidationPattern } from 'utils/common/validationUtils';

const MenuDetailForm = ({ initialFormMode, closeModal, fetchMenuList }) => {
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState([]);
  const [parentMenus, setParentMenus] = useState([
    { label: '상위 메뉴를 선택하세요.' },
    { label: '선택하지 않음', value: 0 },
  ]);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

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

  const menuId = watch('id');
  const allowChildren = watch('allowChildren');
  const allowedRoles = watch('allowedRoles');

  const menuBasicFields = [
    {
      name: 'name',
      label: '이름',
      placeholder: '이름을 입력하세요.',
      rules: {
        required: '이름은 필수 입력 항목입니다.',
        maxLength: {
          value: 12,
          message: '메뉴 이름은 최대 12자 입니다.',
        },
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

  const getRoles = useCallback(
    async (allowedRoles = []) => {
      try {
        const rolesData = await RoleService.getRoles();
        const newRoles = rolesData
          .filter((role) => (isReadMode ? allowedRoles.includes(role.id) : true))
          .map((role) => ({
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
    },
    [addToast, isReadMode]
  );

  const getParentMenu = useCallback(async () => {
    //REMIND 작성 모드일때는 상위 메뉴 못가져옴..
    const excludedId = isCreateMode ? '' : searchParams.get('id');

    if (!isCreateMode && !excludedId) {
      return;
    }

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
  }, [addToast, isCreateMode, searchParams]);

  const fetchMenuDetail = useCallback(
    async (menuId) => {
      try {
        setIsLoading(true);
        const data = await MenuService.getMenuDetail(menuId);
        const formattedData = {
          ...data,
          modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
          createdAt: data.createdAt && formatToYMD(data.createdAt),
        };
        reset(formattedData);
        setFormData(formattedData);
        const allowedRoles = data.allowedRoles.map((role) => role.id);
        await getRoles(allowedRoles);
      } catch (error) {
        //REMIND 권한 에러인지, 메뉴 에러인지 구분해서 에러 처리
        const status = error.response?.status;
        if (status === 400) {
          addToast({ message: '메뉴 정보를 가져오지 못했습니다.' });
        }
        if (status === 404) {
          addToast({ message: `id={${menuId}} 해당 메뉴를 찾을 수 없습니다.` });
        }
        closeModal();
      } finally {
        setIsLoading(false);
      }
    },
    [addToast, closeModal, getRoles, reset]
  );

  useEffect(() => {
    setIsLoading(false);
    const menuId = searchParams.get('id');

    if (!isCreateMode && menuId) {
      void fetchMenuDetail(menuId);
    } else {
      void getRoles();
    }
    void getParentMenu();
  }, [fetchMenuDetail, getParentMenu, getRoles, isCreateMode, searchParams]);

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
    let formattedData = {};
    if (Array.isArray(data.allowedRoles)) {
      const validRoles = data.allowedRoles.filter((role) => role !== undefined);
      if (validRoles.length === 0) {
        formattedData = {
          ...data,
          allowedRoles: allowedRoles.map((role) => role.id),
        };
      }
    }
    try {
      const response = await MenuService.patchMenu(formattedData);
      if (response) {
        fetchMenuList();
        void fetchMenuDetail(menuId);
        setFormMode('read');
        addToast({ color: 'success', message: '메뉴 수정이 완료되었습니다.' });
      }
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
      void postMenu(updatedData);
    } else if (isUpdateMode) {
      void patchMenu(updatedData);
    }
  };

  const handleCancelClick = async () => {
    if (isUpdateMode) {
      setFormMode('read');
      await fetchMenuDetail(searchParams.get('id'));
    } else if (isCreateMode) {
      closeModal();
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setFormMode('update');
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await MenuService.deleteMenus([id], shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    fetchMenuList();
    void fetchMenuDetail(menuId);
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
              <CFormCheck
                {...field}
                id="detail-form-allowChildren"
                checked={field.value}
                disabled={isReadMode}
                label={field.value ? '등록 가능' : '등록 불가능'}
              />
            </CCol>
          )}
        />
      </CCol>
    </CRow>
  );

  const renderRoleSelect = () => (
    <CRow className="mb-3">
      <CCol>
        <CFormLabel htmlFor="detail-form-allowedRoles" className="col-md-2 col-form-label fw-bold">
          인가된 권한
        </CFormLabel>
        <Controller
          name="allowedRoles"
          control={control}
          rules={{ required: '권한은 필수 입력 항목입니다.' }}
          render={({ field }) => (
            <CMultiSelect
              id="detail-form-allowedRoles"
              {...field}
              placeholder="권한을 선택하세요."
              selectAll={!isReadMode}
              selectAllLabel="모두 선택"
              options={roles}
              virtualScroller
              disabled={isReadMode}
              selectionType={isReadMode ? 'text' : 'tags'}
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
      <CCol>
        <CFormLabel htmlFor="detail-form-parentId" className="col-md-2 col-form-label fw-bold">
          상위 메뉴
        </CFormLabel>
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
  const renderAuditFields = () => {
    return (
      <CCard className="g-3 mb-3">
        <CCardBody>
          <FormInputGrid fields={getAuditFields(formMode)} formData={formData} isReadMode={isReadMode} col={2} />
        </CCardBody>
      </CCard>
    );
  };

  return (
    <>
      <FormLoadingCover isLoading={isLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {!isCreateMode && renderAuditFields()}
          <CCard className="g-3 mb-3">
            <CCardBody>
              <FormInputGrid fields={menuBasicFields} isReadMode={isReadMode} register={register} errors={errors} />
              {renderParentSelect()}
              {renderAllowChildrenCheck()}
              <FormInputGrid fields={menuSettingFields} isReadMode={isReadMode} register={register} errors={errors} />
              {renderRoleSelect()}
            </CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={menuId}
          formModes={formModes(formMode)}
          handleCancel={handleCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={handleUpdateClick}
          isDataDeleted={formData.deleted}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};

export default MenuDetailForm;
