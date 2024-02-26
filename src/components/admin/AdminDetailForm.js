import React, { useEffect, useState } from 'react';

import { CButton, CCol, CElementCover, CForm, CMultiSelect, CRow, CSpinner } from '@coreui/react-pro';
import { Controller, useForm } from 'react-hook-form';

import { useToast } from '../../context/ToastContext';
import AdminService from '../../services/admin/AdminService';
import RoleService from '../../services/Role/RoleService';
import { getAuditFields } from '../../utils/common/auditFieldUtils';
import formModes from '../../utils/formModes';
import { emailValidationPattern, passwordValidationPattern } from '../../utils/validationUtils';
import InputList from '../input/InputList';

const AdminDetailForm = ({ selectedId, initialFormMode, closeModal, fetchAdminList }) => {
  const [formData, setFormData] = useState([]);
  const [formMode, setFormMode] = useState(initialFormMode);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const adminFields = [
    {
      name: 'id',
      label: '아이디',
      isDisabled: isUpdateMode,
      isRendered: !isCreateMode,
    },
    {
      name: 'email',
      label: '이메일',
      placeholder: '이메일을 입력하세요.',
      rules: {
        required: '이메일은 필수 입력 항목입니다.',
        pattern: {
          value: emailValidationPattern,
          message: '유효하지 않은 이메일 주소입니다.',
        },
      },
    },
    {
      name: 'name',
      label: '이름',
      placeholder: '이름을 입력하세요.',
      rules: {
        required: '이름은 필수 입력 항목입니다.',
      },
    },
    {
      name: 'password',
      label: '비밀번호',
      type: 'password',
      placeholder: '비밀번호를 입력하세요.',
      isRendered: isCreateMode,
      rules: {
        required: '비밀번호는 필수 입력 항목입니다.',
        pattern: {
          value: passwordValidationPattern,
          message: '대문자, 소문자, 숫자를 포함해야 합니다.',
        },
      },
    },
  ];
  const logInFields = [
    {
      name: 'lastLoggedInAt',
      label: '최근 로그인',
      type: 'date',
      isDisabled: isUpdateMode,
      isRendered: !isCreateMode,
    },
    {
      name: 'failedCnt',
      label: '로그인 실패 횟수',
      type: 'number',
      isRendered: !isCreateMode,
    },
  ];

  useEffect(() => {
    setIsLoading(false);
    if (!isCreateMode && selectedId) {
      fetchAdminDetail();
    } else {
      getRoles();
    }
  }, [selectedId]);

  const fetchAdminDetail = async () => {
    try {
      setIsLoading(true);
      const data = await AdminService.getAdmin(selectedId);
      setFormData(data);
      reset(data);
      const allowedRoles = data.roles;
      await getRoles(allowedRoles);
    } catch (error) {
      addToast({ message: '관리자 정보를 가져오지 못했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoles = async (allowedRoles) => {
    try {
      const rolesData = await RoleService.getRoles();
      const newRoles = rolesData.map((role) => ({
        value: role.role,
        text: role.role,
        selected: allowedRoles?.length > 0 ? allowedRoles.includes(role.role) : false,
      }));
      setRoles(newRoles);
    } catch (error) {
      addToast({ message: '권한 목록을 가져오지 못했습니다.' });
    }
  };

  const createAdmin = async () => {
    try {
      await AdminService.postAdmin(formData);
      closeModal();
      fetchAdminList();
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

  const updateAdmin = async () => {
    try {
      await AdminService.putAdmin(selectedId, formData);
      closeModal();
      fetchAdminList();
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
    setFormData((prev) => ({ ...prev, roles: roleList }));
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = () => {
    if (isCreateMode) {
      createAdmin();
    } else if (isUpdateMode) {
      updateAdmin();
    }
  };

  const handleCancelClick = () => {
    setFormMode('read');
    fetchAdminDetail();
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setFormMode('update');
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await AdminService.deleteAdmin(id, shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    closeModal();
    fetchAdminList();
  };

  const renderRoleSelect = () => (
    <CRow className="mb-3">
      <CCol>
        <Controller
          name="roles"
          control={control}
          rules={{ required: '권한은 필수 입력 항목입니다.' }}
          render={({ field: { onChange } }) => (
            <CMultiSelect
              id="roles"
              name="roles"
              options={roles}
              label="인가된 권한"
              placeholder="권한을 선택하세요."
              selectAllLabel="모두 선택"
              virtualScroller
              onChange={(values) => {
                onChange(values);
                handleMultiSelect(values);
              }}
              disabled={isReadMode}
              invalid={errors.roles}
              feedbackInvalid={errors.roles && errors.roles.message}
            />
          )}
        />
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
          fields={adminFields}
          formData={formData}
          handleChange={handleChange}
          isReadMode={isReadMode}
          control={control}
          errors={errors}
        />
        {renderRoleSelect()}
        <InputList fields={logInFields} formData={formData} handleChange={handleChange} isReadMode={isReadMode} />
        <InputList
          fields={getAuditFields(formMode)}
          formData={formData}
          handleChange={handleChange}
          isReadMode={isReadMode}
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

export default AdminDetailForm;
