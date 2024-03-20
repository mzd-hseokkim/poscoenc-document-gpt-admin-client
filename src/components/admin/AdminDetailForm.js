import React, { useCallback, useEffect, useState } from 'react';

import {
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModalBody,
  CModalFooter,
  CMultiSelect,
  CRow,
} from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FormInputGrid from 'components/input/FormInputGrid';
import { useToast } from 'context/ToastContext';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import AdminService from 'services/admin/AdminService';
import RoleService from 'services/Role/RoleService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/formModes';
import { emailValidationPattern, passwordValidationPattern } from 'utils/validationUtils';

const AdminDetailForm = ({ initialFormMode, closeModal, fetchAdminList }) => {
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [formData, setFormData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const {
    reset,
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const deleted = watch('deleted');
  const adminId = watch('id');

  const adminInfoFields = [
    {
      name: 'name',
      label: '이름',
      placeholder: '이름을 입력하세요.',
      rules: {
        required: '이름은 필수 입력 항목입니다.',
      },
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

  const getRoles = useCallback(
    async (allowedRoles = []) => {
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
    },
    [addToast]
  );

  const fetchAdminDetail = useCallback(
    async (adminId) => {
      try {
        setIsLoading(true);

        const data = await AdminService.getAdmin(adminId);
        const formattedData = {
          ...data,
          modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
          lastLoggedInAt: data.lastLoggedInAt && formatToYMD(data.lastLoggedInAt),
          createdAt: data.createdAt && formatToYMD(data.createdAt),
        };
        reset(formattedData);
        setFormData(formattedData);

        const allowedRoles = data.roles;
        await getRoles(allowedRoles);
      } catch (error) {
        addToast({ message: `id={${adminId}} 해당 관리자를 찾을 수 없습니다.` });
        closeModal();
      } finally {
        setIsLoading(false);
      }
    },
    [addToast, closeModal, getRoles, reset]
  );
  useEffect(() => {
    setIsLoading(false);
    const adminId = searchParams.get('id');
    if (!isCreateMode && adminId) {
      void fetchAdminDetail(adminId);
    } else {
      void getRoles();
    }
  }, [fetchAdminDetail, getRoles, isCreateMode, searchParams]);

  const createAdmin = async (data) => {
    try {
      const result = await AdminService.postAdmin(data);
      if (result) {
        closeModal();
        fetchAdminList();
        setFormMode('read');
      }
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

  const updateAdmin = async (data) => {
    try {
      const result = await AdminService.putAdmin(adminId, data);
      if (result) {
        closeModal();
        fetchAdminList();
        setFormMode('read');
      }
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

  const onSubmit = (data) => {
    const roleList = data.roles.map((item) => item.value);
    const updatedData = { ...data, roles: roleList };

    if (isCreateMode) {
      void createAdmin(updatedData);
    } else if (isUpdateMode) {
      void updateAdmin(updatedData);
    }
  };

  const handleCancelClick = async () => {
    if (isUpdateMode) {
      setFormMode('read');
      await fetchAdminDetail();
    } else if (isCreateMode) {
      closeModal();
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setFormMode('update');
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !deleted;
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
        <CFormLabel htmlFor="detail-form-roles" className="col-md-2 col-form-label fw-bold">
          인가된 권한
        </CFormLabel>
        <Controller
          name="roles"
          control={control}
          rules={{ required: '권한은 필수 입력 항목입니다.' }}
          render={({ field }) => (
            <CMultiSelect
              id="detail-form-roles"
              {...field}
              placeholder="권한을 선택하세요."
              selectAllLabel="모두 선택"
              options={roles}
              virtualScroller
              disabled={isReadMode}
              invalid={!!errors.roles}
              feedbackInvalid={errors.roles?.message}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  const renderAuditFields = () => {
    return (
      <CCard className="g-3 mb-3">
        <CCardBody>
          <CRow>
            <CCol className="col-md mb-2">
              <CCol className="fw-bold">아이디</CCol>
              <CFormInput
                id="input-list-id"
                name="id"
                value={formData.id || ''}
                disabled={!isCreateMode}
                plainText={!isCreateMode}
              />
            </CCol>
            <CCol className="col-md mb-2">
              <CCol className="fw-bold">삭제</CCol>
              <CCol>
                <StatusBadge deleted={formData.deleted} />
              </CCol>
            </CCol>
          </CRow>
          <FormInputGrid fields={getAuditFields(formMode)} formData={formData} isReadMode={isReadMode} col={2} />
        </CCardBody>
      </CCard>
    );
  };

  return (
    <>
      <FormLoadingCover isLoading={isLoading}></FormLoadingCover>
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {!isCreateMode && renderAuditFields()}
          <CCard className="g-2 mb-3">
            <CCardBody>
              <FormInputGrid fields={adminInfoFields} isReadMode={isReadMode} register={register} errors={errors} />
              {renderRoleSelect()}
            </CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={adminId}
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

export default AdminDetailForm;
